import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = uc.ChromeOptions()
driver = uc.Chrome(options=options, version_main=147)  # 크롬 버전 직접 지정!

driver.get('https://www.duolingo.com/login')
print('로그인 페이지 열렸어요!')

wait = WebDriverWait(driver, 10)
email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[data-testid="email-input"]')))
email_input.send_keys('844E9')

time.sleep(1)

password_input = driver.find_element(By.CSS_SELECTOR, 'input[data-testid="password-input"]')
password_input.send_keys('cys#2714')

time.sleep(1)

login_btn = driver.find_element(By.CSS_SELECTOR, 'button[data-testid="register-button"]')
login_btn.click()

print('로그인 시도!')
time.sleep(5)
print('현재 URL:', driver.current_url)