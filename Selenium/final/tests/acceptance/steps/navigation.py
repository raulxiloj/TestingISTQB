from behave import * 
from selenium import webdriver

use_step_matcher('re')

@given('Estoy en la pagina Home')
def step_impl(context):
    context.browser = webdriver.Chrome('C:\\chromedriver.exe')
    context.browser.get('http://127.0.0.1:5000')


@then('Estoy en la pagina Blog')
def step_impl(context):
    expected_url = 'http://127.0.0.1:5000/blog'
    assert context.browser.current_url == expected_url 
