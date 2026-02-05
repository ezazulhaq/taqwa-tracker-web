from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        page.goto("http://localhost:4200/home")

        # Handle Welcome Popup
        try:
            # Wait for the welcome popup title
            page.wait_for_selector('text=Welcome to Your Spiritual Journey', timeout=5000)
            print("Welcome popup found. Closing it.")

            # Click "Don't show again"
            page.get_by_role("button", name="Don't show again").click()

            # Wait for it to disappear
            page.wait_for_selector('text=Welcome to Your Spiritual Journey', state='hidden')
            print("Welcome popup closed.")
        except Exception as e:
            print(f"Welcome popup not found or error closing it: {e}")

        # Wait for the streak dashboard to be visible
        # It's an element <app-streak-dashboard>
        page.wait_for_selector('app-streak-dashboard')

        # Wait a bit for animations
        page.wait_for_timeout(1000)

        # Take a screenshot
        page.screenshot(path="verification_streak.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
