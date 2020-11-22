import os

DJ_SECRET = os.getenv("DJ_SECRET", '3loz!pdqynt==#jd!7q5unl@ri@!xplx#)cl)fq87t&hws!f!0')
DJ_DEBUG = os.getenv("DJ_DEBUG", True)
DJ_ALLOW_HOSTS = os.getenv("DJ_ALLOW_HOSTS", "localhost").split(",")