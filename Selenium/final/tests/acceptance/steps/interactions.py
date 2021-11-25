from behave import * 
from selenium import webdriver

use_step_matcher('re')

@when('Cuando presione el boton "Ingresar" con id "blog-link"')
def step_impl(context):
    link = context.browser.find_element_by_id('blog-link')
    link.click()