import logging
from threading import get_ident


def get_logger():
    """
    Creates a logger for the different workers, it checks if it already exists.
    :return: a new logger if it does not exist, the existing logger otherwise
    """
    logger = logging.getLogger(str(get_ident()))
    logger.setLevel(logging.DEBUG)
    logger.propagate = False
    if logger.hasHandlers():
        return logger
    else:
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(logging.Formatter("%(threadName)s [%(levelname)s]: %(message)s"))
        logger.addHandler(ch)
        return logger
