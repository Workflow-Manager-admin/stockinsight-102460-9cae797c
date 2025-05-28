# StockInsight stock data API routes

from flask_smorest import Blueprint
from flask.views import MethodView
from flask import request
import yfinance as yf
import psycopg2
import os
blp = Blueprint("Stock", "stock", url_prefix="/api/stock", description="Stock data endpoints")

# Use environment vars for DB connection (fallback to defaults for dev/demo)
DB_NAME = os.environ.get("POSTGRES_DB", "stocks")
DB_USER = os.environ.get("POSTGRES_USER", "postgres")
DB_PASS = os.environ.get("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.environ.get("POSTGRES_HOST", "localhost")
DB_PORT = int(os.environ.get("POSTGRES_PORT", 5432))

def get_db_conn():
    """Return new connection for PostgreSQL db."""
    return psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT
    )


def upsert_stock_query(ticker, company_name):
    """Store searched ticker in database with timestamp. Add if new; update timestamp if seen before."""
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS searched_stocks (
                id SERIAL PRIMARY KEY,
                ticker VARCHAR(12) NOT NULL,
                name TEXT,
                last_searched TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        cur.execute(
            """
            INSERT INTO searched_stocks (ticker, name, last_searched)
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (ticker)
            DO UPDATE SET last_searched = CURRENT_TIMESTAMP, name = EXCLUDED.name;
            """,
            (ticker.upper(), company_name),
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception:
        pass  # Don't block API if DB fails


# PUBLIC_INTERFACE
@blp.route("/info/<string:ticker>")
class StockInfo(MethodView):
    """Get company info and current price by ticker."""

    def get(self, ticker):
        t = yf.Ticker(ticker)
        info = t.info or {}
        # Defensive info extraction
        company_info = {
            "ticker": ticker.upper(),
            "name": info.get("shortName") or info.get("longName") or "",
            "sector": info.get("sector") or "",
            "industry": info.get("industry") or "",
            "currentPrice": info.get("currentPrice"),
            "marketCap": info.get("marketCap"),
            "exchange": info.get("exchange") or "",
            "currency": info.get("currency") or "",
            "logo_url": info.get("logo_url") or "",
            "website": info.get("website") or "",
            "description": info.get("longBusinessSummary") or "",
        }
        if company_info["name"]:
            upsert_stock_query(ticker, company_info["name"])
        return company_info


# PUBLIC_INTERFACE
@blp.route("/history/<string:ticker>")
class StockHistory(MethodView):
    """Get historical price data."""

    def get(self, ticker):
        timeframe = request.args.get("timeframe", "1mo")
        valid_times = {
            "1d": ("1d", "1m"),
            "5d": ("5d", "5m"),
            "1mo": ("1mo", "1h"),
            "6mo": ("6mo", "1d"),
            "1y": ("1y", "1d"),
        }
        period, interval = valid_times.get(timeframe, ("1mo", "1h"))
        t = yf.Ticker(ticker)
        hist = t.history(period=period, interval=interval)
        if hist.empty:
            return {"prices": [], "timeframe": timeframe}
        ohlc = [
            {
                "datetime": (
                    d.strftime("%Y-%m-%d %H:%M")
                    if not isinstance(d, str)
                    else d
                ),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]),
            }
            for d, row in hist.iterrows()
        ]
        return {"prices": ohlc, "timeframe": timeframe}


# PUBLIC_INTERFACE
@blp.route("/recent")
class RecentlySearched(MethodView):
    """List recently searched tickers."""
    def get(self):
        try:
            conn = get_db_conn()
            cur = conn.cursor()
            cur.execute("""
                SELECT ticker, name, last_searched FROM searched_stocks
                ORDER BY last_searched DESC LIMIT 10;
            """)
            results = [
                {"ticker": row[0], "name": row[1], "last_searched": row[2].strftime("%Y-%m-%d %H:%M")}
                for row in cur.fetchall()
            ]
            cur.close()
            conn.close()
            return {"recent": results}
        except Exception:
            return {"recent": []}
