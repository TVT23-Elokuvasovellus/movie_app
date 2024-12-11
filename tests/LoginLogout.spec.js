import { test, expect } from "@playwright/test"

test('Login to existing account and log out', async ({ page }) => {
  await page.goto("http://localhost:3000/")

  // Sign in
  await page.getByRole('link', {name: 'Log In.'}).click();

  // Enter email
  await page.getByPlaceholder("Email").click();
  await page.getByPlaceholder("Email").fill("esimerkki2@test.com")

  // Enter password
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("salasana")

  // Go to profile page
  await page.getByRole('button', {name: "profile"}).click()

  // Start account deletion
  await page.getByRole('button', {name: 'Account Deletion'}).click()
  await page.getByPlaceholder("Enter your email address").click();
  await page.getByPlaceholder("Enter your email address").fill("esimerkki2@test.com")

  // Confirm account deletion
  await page.getByText('I\'m sure(this cannot be').click();
  await page.getByRole('button', {name: 'Confirm account deletion'}).click()
});
