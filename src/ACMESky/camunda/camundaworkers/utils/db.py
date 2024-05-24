from os import environ
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base 

Base = declarative_base() 

def create_sql_engine():
    """
    Create the SQL Engine requested to connect to postgreSQL
    :return: a sqlachelmy::engine
    """
    pg_user = environ.get('POSTGRES_USER')
    pg_psw = environ.get('POSTGRES_PASSWORD')
    pg_host = environ.get('POSTGRES_HOST')
    pg_db = environ.get('POSTGRES_DB')

    return create_engine(f'postgresql://{pg_user}:{pg_psw}@{pg_host}:5432/{pg_db}')
