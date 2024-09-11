from setuptools import setup

setup(
    name='yogpt',
    version='0.1',
    py_modules=['cli'],  # Points to cli.py
    install_requires=[
        'click',
        'uvicorn',
    ],
    entry_points='''
        [console_scripts]
        yogpt=cli:cli
    ''',
)
