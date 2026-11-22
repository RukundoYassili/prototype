import { test, expect } from "@playwright/test";

// Requires only the disposable local server; do not run against production.
test("real local account can create, edit, submit and approve a private draft", async ({
  page,
}) => {
  await page.goto("/staff/content");
  await page.getByLabel("Username").fill("testadmin");
  await page.getByLabel("Password").fill("temporary-testing-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back, testadmin." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create content" }).click();
  await page.getByLabel("Title", { exact: true }).fill("A safe local draft");
  await page.getByLabel("Summary").fill("A private test item.");
  await page.getByLabel("Topic").fill("Wellbeing");
  await page.getByRole("button", { name: "Create draft" }).click();
  await page.getByRole("button", { name: "Open A safe local draft" }).click();
  await page.getByLabel("Draft text").fill("This is a local test.");
  await page.getByLabel("Content author").fill("A local reviewer");
  await page.getByLabel("Next review date").fill("2027-01-15");
  await page.getByLabel("Block type").selectOption("table");
  await page.getByRole("button", { name: "Add block" }).click();
  await page.getByLabel("Column 1 heading").fill("Question");
  await page.getByLabel("Column 2 heading").fill("Answer");
  await page.getByLabel("Row 1, column 1").fill("Why?");
  await page.getByLabel("Row 1, column 2").fill("Because.");
  await expect(
    page.getByRole("button", { name: "Submit for review" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(
    page.getByText("Revision 2. This content is private."),
  ).toBeVisible();
  await expect(page.getByLabel("Content author")).toHaveValue(
    "A local reviewer",
  );
  await expect(page.getByLabel("Row 1, column 2")).toHaveValue("Because.");
  await page.getByRole("button", { name: "Preview draft" }).click();
  const preview = page.getByRole("dialog", { name: "Private draft preview" });
  await expect(
    preview.getByRole("columnheader", { name: "Question" }),
  ).toBeVisible();
  await preview.getByRole("button", { name: "Mobile" }).click();
  await expect(preview.getByRole("button", { name: "Mobile" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(preview).toHaveCount(0);
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(
    page.getByRole("button", { name: "Approve revision" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Approve revision" }).click();
  await expect(page.getByRole("status")).toContainText("approved");
  await expect(
    page.getByText("Publishing to the website is not connected yet."),
  ).toBeVisible();
  await page.getByText("Previous revisions").click();
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Restore" }).click();
  await expect(
    page.getByText("Revision 3. This content is private."),
  ).toBeVisible();
  await expect(page.getByLabel("Draft text")).toHaveValue("");
  await page.getByRole("button", { name: "Add language version" }).click();
  await page.getByLabel("Language name").fill("French");
  await page.getByLabel("Translated title").fill("Un brouillon");
  await page.getByLabel("Translated summary").fill("Un résumé privé.");
  await page.getByRole("button", { name: "Create language draft" }).click();
  await expect(
    page.getByText("Revision 1. This content is private."),
  ).toBeVisible();
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue(
    "French",
  );
});

test("an administrator can grant author access without granting review rights", async ({
  page,
}) => {
  await page.goto("/staff/content");
  await page.getByLabel("Username").fill("testadmin");
  await page.getByLabel("Password").fill("temporary-testing-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  const member = page.getByRole("group", { name: "teststaff" });
  await member.getByLabel("Author").check();
  await expect(page.getByRole("status")).toContainText(
    "Editorial access updated",
  );
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.getByLabel("Username").fill("teststaff");
  await page.getByLabel("Password").fill("temporary-testing-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Create content" }).click();
  await page.getByLabel("Title", { exact: true }).fill("A staff draft");
  await page.getByLabel("Summary").fill("A private staff test.");
  await page.getByLabel("Topic").fill("Wellbeing");
  await page.getByRole("button", { name: "Create draft" }).click();
  await page.getByRole("button", { name: "Open A staff draft" }).click();
  await page.getByLabel("Draft text").fill("A private draft for review.");
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByRole("status")).toContainText("submitted for review");
  await expect(
    page.getByRole("button", { name: "Approve revision" }),
  ).toHaveCount(0);
});
