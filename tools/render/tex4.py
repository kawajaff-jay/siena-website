"""More screen/document textures for the era signatures. Run: python tex4.py"""
import os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from tex import OUT, aged_paper, noise
from tex2 import font, save, handwritten
import tex3


def login(name, product, accent, W=1600, H=1000, seed=0, dark=False):
    bg = (18, 24, 38) if dark else (240, 243, 248)
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    card = (30, 40, 62) if dark else (255, 255, 255)
    d.rounded_rectangle((W / 2 - 300, 170, W / 2 + 300, 830), radius=24, fill=card)
    d.ellipse((W / 2 - 40, 220, W / 2 + 40, 300), fill=accent)
    d.text((W / 2, 350), product, font=font("uim", 40), fill=(230, 235, 250) if dark else (30, 36, 50), anchor="mm")
    d.text((W / 2, 400), "Sign in to continue", font=font("ui", 24), fill=(140, 150, 170), anchor="mm")
    for i, lab in enumerate(("Email", "Password")):
        y = 460 + i * 110
        d.text((W / 2 - 250, y), lab, font=font("ui", 22), fill=(140, 150, 170))
        d.rounded_rectangle((W / 2 - 250, y + 32, W / 2 + 250, y + 86), radius=10, outline=(190, 196, 210) if not dark else (70, 82, 110), width=2)
        if i == 1:
            for k in range(10):
                d.ellipse((W / 2 - 230 + k * 22, y + 52, W / 2 - 218 + k * 22, y + 64), fill=(90, 100, 120))
    d.rounded_rectangle((W / 2 - 250, 700, W / 2 + 250, 760), radius=10, fill=accent)
    d.text((W / 2, 730), "Sign in", font=font("uim", 26), fill=(255, 255, 255), anchor="mm")
    d.text((W / 2, 795), "Forgot password?  ·  Use SSO", font=font("ui", 20), fill=(120, 130, 150), anchor="mm")
    save(im, name)


def chat(name="chat.png", W=1600, H=1000):
    im = Image.new("RGB", (W, H), (26, 29, 33))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 300, H), fill=(35, 20, 45))
    for i, ch in enumerate(["# general", "# sales", "# ops-alerts", "# finance", "# support", "# marketing", "# random", "# integrations", "# incidents"]):
        d.text((24, 90 + i * 46), ch, font=font("ui", 24), fill=(210, 200, 225) if i != 2 else (255, 255, 255))
        if i in (1, 2, 4, 7):
            d.rounded_rectangle((250, 92 + i * 46, 284, 118 + i * 46), radius=12, fill=(225, 60, 80))
    rng = random.Random(3)
    msgs = ["Can someone export the CRM list again?", "The invoice sync failed overnight ⚠", "Which dashboard has the real numbers?", "Re-sent the login link to the vendor portal", "Inventory sheet v7_FINAL_final.xlsx", "Ticket #4812 escalated", "Zap stopped running, checking", "Who owns the pipeline report?"]
    y = 60
    for m in msgs:
        d.ellipse((330, y, 380, y + 50), fill=rng.choice([(90, 160, 220), (220, 150, 80), (120, 190, 130), (200, 110, 160)]))
        d.text((400, y), rng.choice(["Maya", "Omar", "Lee", "Sara", "Tom"]), font=font("uim", 24), fill=(235, 235, 240))
        d.text((400, y + 32), m, font=font("ui", 24), fill=(200, 202, 210))
        y += 110
    save(im, name)


def inbox(name="inbox.png", W=1600, H=1000):
    im = Image.new("RGB", (W, H), (250, 250, 252))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 70), fill=(35, 90, 200))
    d.text((30, 18), "Inbox (1,284)", font=font("uim", 30), fill=(255, 255, 255))
    rng = random.Random(4)
    subs = ["Action required: renew license", "Your weekly analytics report", "RE: RE: pricing sheet", "New lead assigned", "Password expires in 3 days", "Invoice #2291 overdue", "Webinar reminder", "Sync error: 14 records", "Approval needed: PO-5531", "Q3 dashboard link (updated)"]
    for i in range(12):
        y = 90 + i * 74
        d.rectangle((0, y, W, y + 72), fill=(255, 255, 255) if i % 2 else (244, 246, 250))
        d.ellipse((24, y + 26, 40, y + 42), fill=(35, 90, 200) if i < 7 else (220, 220, 225))
        d.text((64, y + 10), rng.choice(["Accounts", "HR Portal", "CRM", "IT Service", "Marketing Ops", "Finance"]), font=font("uim", 24), fill=(30, 30, 40))
        d.text((64, y + 40), subs[i % len(subs)], font=font("ui", 22), fill=(90, 95, 110))
    save(im, name)


def kanban(name="kanban.png", W=1600, H=1000):
    im = Image.new("RGB", (W, H), (235, 238, 244))
    d = ImageDraw.Draw(im)
    rng = random.Random(5)
    for c, title in enumerate(["Backlog", "To do", "In progress", "Review", "Done"]):
        x = 30 + c * 314
        d.rounded_rectangle((x, 30, x + 294, H - 30), radius=14, fill=(222, 226, 234))
        d.text((x + 18, 44), f"{title}  {rng.randint(3, 19)}", font=font("uim", 24), fill=(50, 56, 70))
        y = 96
        for k in range(rng.randint(3, 7)):
            h = rng.randint(80, 130)
            d.rounded_rectangle((x + 12, y, x + 282, y + h), radius=10, fill=(255, 255, 255))
            d.rectangle((x + 12, y, x + 18, y + h), fill=rng.choice([(90, 140, 255), (255, 150, 80), (120, 200, 140), (230, 90, 110)]))
            d.rectangle((x + 30, y + 18, x + 30 + rng.randint(120, 220), y + 30), fill=(190, 196, 210))
            d.rectangle((x + 30, y + 44, x + 30 + rng.randint(80, 180), y + 54), fill=(215, 220, 230))
            y += h + 12
    save(im, name)


def video_call(name="videocall.png", W=1600, H=1000):
    im = Image.new("RGB", (W, H), (22, 24, 28))
    d = ImageDraw.Draw(im)
    rng = random.Random(6)
    for i in range(6):
        x, y = 30 + (i % 3) * 520, 40 + (i // 3) * 440
        tone = rng.choice([(60, 70, 90), (80, 70, 60), (50, 70, 70), (70, 60, 80)])
        d.rounded_rectangle((x, y, x + 500, y + 420), radius=14, fill=tone)
        # soft-focus room + person silhouette
        d.ellipse((x + 180, y + 110, x + 320, y + 260), fill=tuple(min(255, c + 70) for c in tone))
        d.rounded_rectangle((x + 130, y + 250, x + 370, y + 420), radius=60, fill=tuple(min(255, c + 40) for c in tone))
        d.text((x + 18, y + 380), rng.choice(["Maya", "Omar", "Lee", "Sara", "Tom", "Ana"]), font=font("ui", 24), fill=(240, 240, 245))
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((W / 2 - 220, H - 90, W / 2 + 220, H - 20), radius=30, fill=(40, 44, 52))
    d.ellipse((W / 2 - 30, H - 80, W / 2 + 30, H - 30), fill=(220, 60, 60))
    save(im, name)


def clock_label(city, name):
    im = Image.new("RGB", (600, 120), (18, 20, 24))
    d = ImageDraw.Draw(im)
    d.text((300, 60), city.upper(), font=font("uim", 54), fill=(225, 228, 235), anchor="mm")
    save(im, name)


def card_index(name="indexcard.png"):
    im = Image.new("RGB", (800, 500), (236, 230, 212))
    d = ImageDraw.Draw(im)
    d.line((0, 80, 800, 80), fill=(190, 80, 70), width=3)
    for y in range(120, 500, 40):
        d.line((0, y, 800, y), fill=(150, 170, 200), width=2)
    rng = random.Random(8)
    handwritten(d, (30, 20), "HARGREAVES & SONS  —  Acct 1142", 34, (30, 30, 50), rng)
    for i in range(6):
        handwritten(d, (30, 88 + i * 40), f"{rng.randint(1, 28)} Mar   Goods on account   £{rng.randint(2, 90)} {rng.randint(0, 19)}s", 28, (30, 30, 50), rng)
    save(im, name)


def memo_pad(name="sticky.png", color=(250, 228, 110), text="login: ops_admin"):
    im = Image.new("RGB", (400, 400), color)
    d = ImageDraw.Draw(im)
    rng = random.Random(len(text))
    handwritten(d, (30, 120), text, 40, (40, 40, 60), rng)
    handwritten(d, (30, 190), "pw reset?", 40, (40, 40, 60), rng)
    save(im, name)


def spreadsheet_modern(name="sheet_modern.png", W=1600, H=1000):
    im = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 60), fill=(24, 110, 70))
    d.text((24, 12), "Q3_forecast_v7_FINAL (2)", font=font("uim", 28), fill=(255, 255, 255))
    rng = random.Random(9)
    for r in range(28):
        for c in range(9):
            x, y = 50 + c * 170, 80 + r * 32
            d.rectangle((x, y, x + 170, y + 32), outline=(225, 228, 232))
            if r == 0:
                d.text((x + 8, y + 5), ["Region", "Owner", "Q1", "Q2", "Q3", "Q4", "Δ", "Source", "Status"][c], font=font("uim", 20), fill=(40, 40, 50))
            else:
                v = rng.choice([f"{rng.randint(1, 99)},{rng.randint(100, 999)}", "#REF!", "CRM", "ERP", "manual", "✓", "pending"]) if c > 1 else rng.choice(["North", "South", "EMEA", "APAC", "Maya", "Omar"])
                d.text((x + 8, y + 5), v, font=font("ui", 20), fill=(200, 40, 40) if v == "#REF!" else (60, 64, 74))
    save(im, name)


if __name__ == "__main__":
    login("login_crm.png", "Pipeline CRM", (40, 110, 240))
    login("login_erp.png", "Operations ERP", (20, 150, 110), dark=True)
    login("login_hr.png", "People Portal", (140, 70, 200))
    login("login_bi.png", "Analytics Hub", (240, 130, 40), dark=True)
    chat()
    inbox()
    kanban()
    video_call()
    for c in ("New York", "London", "Dubai", "Tokyo"):
        clock_label(c, f"clock_{c.split()[0].lower()}.png")
    card_index()
    memo_pad()
    memo_pad("sticky2.png", (160, 220, 250), "CRM ≠ ERP totals")
    memo_pad("sticky3.png", (250, 170, 190), "new portal login")
    spreadsheet_modern()
    tex3.wood_maps("oaklight", (0.46, 0.34, 0.22), (0.72, 0.58, 0.42), ring_freq=16, planks=4, seed=12, figure=0.3)
    tex3.wood_maps("goldenoak", (0.3, 0.17, 0.07), (0.6, 0.4, 0.2), ring_freq=14, planks=3, seed=14, figure=0.5)
    print("ok")
