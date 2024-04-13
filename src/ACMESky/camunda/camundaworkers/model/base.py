from os import environ
from sqlalchemy import create_engine


def create_sql_engine():
    """
    Create the SQL Engine requested to connect to postgreSQL
    :return: a sqlachelmy::engine
    """
    pg_user = environ.get('POSTGRES_USER')
    pg_psw = environ.get('POSTGRES_PASSWORD')

    return create_engine(f'postgresql://{pg_user}:{pg_psw}@acmesky_db:5432/acmesky')
