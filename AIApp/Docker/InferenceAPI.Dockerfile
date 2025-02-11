# cd AIChef/AIApp/
# DOCKER_BUILDKIT=1
# docker build -t aiinferenceapi -f Docker/InferenceAPI.Dockerfile .
# docker run --name AIInference -e ACTUAL_API_KEY="$VALID_API_KEY" -d -it -p 8000:8000 aiinferenceapi 

# The builder image, used to build the virtual environment
FROM python:3.13 AS builder

# Set environment variables
ENV POETRY_VERSION=2.0.1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Installing Poetry Version
RUN pip install poetry==$POETRY_VERSION

# Set the Working Directory
WORKDIR /app

# Copying only Necessary Files
COPY pyproject.toml poetry.lock ./

# Or Poetry will Complain
RUN touch README.md	

# Installing only the Virtual Environment Dependencies and Removing Cache
RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR 

# The runtime image, used to just run the code provided its virtual environment (Passed by the Builder Image)
FROM python:3.13-slim AS runtime

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"	

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

# Set the working directory
WORKDIR /app

# Copying Data
COPY src ./

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
