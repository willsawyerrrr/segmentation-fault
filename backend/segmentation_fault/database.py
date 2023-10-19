from os import getenv

from mysql.connector import MySQLConnection, connect
from mysql.connector.abstracts import MySQLConnectionAbstract

db: MySQLConnection = connect(
    user=getenv("DB_USER"),
    password=getenv("DB_PASSWORD"),
    host=getenv("DB_HOST"),
    database=getenv("DB_NAME"),
    buffered=True,
)

# Monkey patch the `MySQLConnectionAbstract` class to have a cursor which returns dictionaries.
MySQLConnectionAbstract.dict_cursor = lambda self: self.cursor(dictionary=True)
