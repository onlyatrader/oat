# OAT Project - Claude Configuration

## Available Skills

### FRED Economic Data (`scientific-skills/fred-economic-data/`)

Query the Federal Reserve Economic Data (FRED) API for 800,000+ economic time series.

**Setup:** Requires `FRED_API_KEY` environment variable. Get a free key at https://fredaccount.stlouisfed.org

**Usage:**
```python
import sys
sys.path.insert(0, "scientific-skills/fred-economic-data")
from scripts.fred_query import FREDQuery

fred = FREDQuery()  # Uses FRED_API_KEY env var

# Get GDP data
gdp = fred.get_observations("GDP", limit=5, sort_order="desc")

# Search for series
results = fred.search_series("inflation", limit=10)

# Get unemployment rate
unrate = fred.get_observations("UNRATE", observation_start="2024-01-01")
```

**Key series IDs:** GDP, UNRATE (unemployment), CPIAUCSL (CPI), FEDFUNDS (fed funds rate), DGS10 (10yr Treasury), HOUST (housing starts)

**Reference docs:** See `scientific-skills/fred-economic-data/references/` for detailed API endpoint documentation.

**Examples:** See `scientific-skills/fred-economic-data/scripts/fred_examples.py` for comprehensive usage examples.
