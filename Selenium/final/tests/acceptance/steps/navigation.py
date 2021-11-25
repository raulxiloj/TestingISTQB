from behave import * 
from selenium import webdriver

use_step_matcher('re')

@given('Estoy en la pagina Home')
def step_impl(context):
    browser = webdriver.Chrome()
    browser.get('http://127.0.0.1:5000')