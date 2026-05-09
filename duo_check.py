import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import getpass

options = uc.ChromeOptions()
driver = uc.Chrome(options=options, version_main=147)  # 크롬 버전 직접 지정!

# 환경변수에서 읽거나, 없으면 직접 입력받음
email = os.environ.get('DUOLINGO_EMAIL') or input('듀오링고 이메일: ')
password = os.environ.get('DUOLINGO_PASSWORD') or getpass.getpass('비밀번호: ')

driver.get('https://www.duolingo.com/login')
print('로그인 페이지 열렸어요!')

wait = WebDriverWait(driver, 10)
email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[data-testid="email-input"]')))
email_input.send_keys(email)

time.sleep(1)

password_input = driver.find_element(By.CSS_SELECTOR, 'input[data-testid="password-input"]')
password_input.send_keys(password)

time.sleep(1)

login_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-testid="register-button"]')
login_btn.click()

print('로그인 시도!')
time.sleep(5)
print('현재 URL:', driver.current_url)