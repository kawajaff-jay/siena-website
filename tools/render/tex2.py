"""Documents, screens and backdrops for the modern eras. Run: python tex2.py"""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from tex import OUT, aged_paper, noise, bez

F = "/usr/share/fonts/truetype"
def font(name, size):
    paths = {
        "script": f"{F}/google-fonts/Lora-Italic-Variable.ttf",
        "serif": f"{F}/crosextra/Caladea-Regular.ttf",
        "mono": f"{F}/dejavu/DejaVuSansMono.ttf",
        "monob": f"{F}/dejavu/DejaVuSansMono-Bold.ttf",
        "sans": f"{F}/crosextra/Carlito-Regular.ttf",
        "sansb": f"{F}/crosextra/Carlito-Bold.ttf",
        "ui": f"{F}/google-fonts/Poppins-Regular.ttf",
        "uim": f"{F}/google-fonts/Poppins-Medium.ttf",
        "uil": f"{F}/google-fonts/Poppins-Light.ttf",
        "lib": f"{F}/liberation/LiberationSans-Regular.ttf",
        "libb": f"{F}/liberation/LiberationSans-Bold.ttf",
        "cour": f"{F}/liberation/LiberationMono-Regular.ttf",
    }
    return ImageFont.truetype(paths[name], size)


def save(im, name):
    im.save(os.path.join(OUT, name))


def handwritten(d, xy, text, size, ink, rng, f="script"):
    x, y = xy
    fnt = font(f, size)
    for ch in text:
        d.text((x, y + rng.uniform(-1.2, 1.2)), ch, font=fnt, fill=ink)
        x += d.textlength(ch, font=fnt) * rng.uniform(0.97, 1.05)
    return x


# ───────── c.1400 ledger (Venetian double-entry) ─────────
def ledger1400():
    rng = random.Random(1)
    W, H = 2400, 1600
    im = aged_paper(W, H, base=(214, 196, 158), seed=21, edge=0.45, stains=9)
    d = ImageDraw.Draw(im)
    ink = (58, 34, 18)
    for page, x0 in ((0, 90), (1, W // 2 + 40)):
        d.line((x0 + 150, 110, x0 + 150, H - 90), fill=(140, 90, 60), width=2)
        d.line((x0 + W // 2 - 260, 110, x0 + W // 2 - 260, H - 90), fill=(140, 90, 60), width=2)
        y = 150
        handwritten(d, (x0 + 380, 70), "MCCCCII  ·  Dare" if page == 0 else "MCCCCII  ·  Avere", 44, ink, rng)
        items = ["Ser Marco di Giovanni", "per panni di lana", "per pepe e zenzero", "per cassa contanti", "Bartolo speziale", "per seta di Damasco", "per sale", "Iacopo cambiatore", "per lettera di cambio", "per noli di nave"]
        while y < H - 160:
            handwritten(d, (x0 + 20, y), f"{rng.randint(1, 28)}", 34, ink, rng)
            handwritten(d, (x0 + 175, y), rng.choice(items), 36, ink, rng)
            handwritten(d, (x0 + W // 2 - 240, y), f"L {rng.randint(2, 90)}  s {rng.randint(1, 19)}", 34, ink, rng)
            y += 78
    d.line((W // 2, 0, W // 2, H), fill=(120, 90, 60), width=6)
    save(im.filter(ImageFilter.GaussianBlur(0.7)), "ledger1400.png")


# ───────── c.1750 printed price current ─────────
def printed1750():
    rng = random.Random(2)
    W, H = 1400, 1900
    im = aged_paper(W, H, base=(226, 214, 186), seed=31, edge=0.3, stains=4)
    d = ImageDraw.Draw(im)
    ink = (28, 24, 22)
    d.text((W // 2, 110), "PRICE CURRENT", font=font("serif", 92), fill=ink, anchor="mm")
    d.text((W // 2, 200), "of Merchandize, as sold at the Exchange", font=font("script", 40), fill=ink, anchor="mm")
    d.line((120, 250, W - 120, 250), fill=ink, width=3)
    d.line((120, 258, W - 120, 258), fill=ink, width=1)
    goods = ["Pepper, black", "Cinnamon", "Cloves", "Nutmegs", "Indigo", "Coffee, Mocha", "Tea, Bohea", "Sugar, Muscovado", "Silk, raw", "Cotton wool", "Rice", "Tobacco", "Madder", "Gum Arabic", "Dates", "Almonds", "Wine, Madeira", "Iron, in bars", "Tin", "Copper"]
    y = 300
    for g in goods:
        d.text((140, y), g, font=font("serif", 40), fill=ink)
        d.text((W - 380, y), f"{rng.randint(1, 9)} l. {rng.randint(0, 19)} s. {rng.randint(0, 11)} d.", font=font("serif", 40), fill=ink)
        for x in range(560, W - 400, 18):
            d.point((x, y + 30), fill=ink)
        y += 72
    d.line((120, y + 10, W - 120, y + 10), fill=ink, width=2)
    d.text((W // 2, y + 70), "Printed for the Company of Merchants", font=font("script", 36), fill=ink, anchor="mm")
    a = np.asarray(im).astype(np.float32)
    n = noise(W, H, 3, 2, 5)[..., None]
    a = np.where(a < 120, a + n * 60, a)  # uneven letterpress inking
    save(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), "printed1750.png")


# ───────── c.1880 account book / 1920s ledger ─────────
def accountbook(name="accountbook1880.png", year="1884", seed=3, headers=False, base=(236, 228, 208)):
    rng = random.Random(seed)
    W, H = 2400, 1600
    im = aged_paper(W, H, base=base, seed=40 + seed, edge=0.25, stains=3)
    d = ImageDraw.Draw(im)
    blue, red, ink = (120, 150, 200), (190, 70, 60), (25, 25, 45)
    for x0 in (60, W // 2 + 40):
        for y in range(170, H - 60, 44):
            d.line((x0, y, x0 + W // 2 - 110, y), fill=blue, width=2)
        for x in (x0 + 130, x0 + 820, x0 + 950, x0 + W // 2 - 260, x0 + W // 2 - 130):
            d.line((x, 110, x, H - 60), fill=red, width=3)
        d.line((x0, 150, x0 + W // 2 - 110, 150), fill=red, width=3)
        d.line((x0, 156, x0 + W // 2 - 110, 156), fill=red, width=2)
        if headers:
            for tx, t in ((x0 + 20, "DATE"), (x0 + 150, "PARTICULARS"), (x0 + 830, "FOL."), (x0 + W // 2 - 250, "£"), (x0 + W // 2 - 120, "s  d")):
                d.text((tx, 115), t, font=font("sansb", 26), fill=red)
        y = 178
        items = ["To Balance", "By Cash", "To Goods", "By Bills Receivable", "To Wages", "By Sales", "To Freight", "To Interest", "By Discount", "To Stationery", "By Commission", "To Rent"]
        for k in range(rng.randint(22, 26)):
            handwritten(d, (x0 + 20, y - 4), f"{rng.randint(1, 30)}", 30, ink, rng)
            handwritten(d, (x0 + 150, y - 4), rng.choice(items), 32, ink, rng)
            handwritten(d, (x0 + 840, y - 4), f"{rng.randint(10, 99)}", 28, ink, rng)
            handwritten(d, (x0 + W // 2 - 250, y - 4), f"{rng.randint(1, 480):>3}", 30, ink, rng)
            handwritten(d, (x0 + W // 2 - 120, y - 4), f"{rng.randint(0, 19)}  {rng.randint(0, 11)}", 28, ink, rng)
            y += 44
    handwritten(d, (W // 2 - 320, 40), year, 60, ink, rng)
    d.line((W // 2, 0, W // 2, H), fill=(150, 130, 110), width=5)
    save(im.filter(ImageFilter.GaussianBlur(0.6)), name)


# ───────── 1950s typed memo ─────────
def typed_memo():
    W, H = 1275, 1650
    im = Image.new("RGB", (W, H), (240, 236, 226))
    a = np.asarray(im).astype(np.float32) * (0.97 + 0.04 * noise(W, H, 40, 4, 8)[..., None])
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    f = font("cour", 30)
    lines = ["INTER-OFFICE MEMORANDUM", "", "TO:      All Department Heads", "FROM:    Office Manager", "DATE:    March 14, 1957", "RE:      Monthly Sales Figures", "", "Please submit your department's figures", "to Accounting by Friday. Punch card", "tabulation will run over the weekend.", "", "Region       Units     Amount", "-----------  -------   ----------", "North          1,240   $ 18,600.00", "South            985   $ 14,775.00", "East           1,512   $ 22,680.00", "West           1,101   $ 16,515.00", "", "Total          4,838   $ 72,570.00"]
    y = 150
    rng = random.Random(4)
    for ln in lines:
        x = 130
        for ch in ln:
            dark = rng.randint(10, 60)
            d.text((x + rng.uniform(-0.6, 0.6), y + rng.uniform(-0.8, 0.8)), ch, font=f, fill=(dark, dark, dark + 5))
            x += 18
        y += 52
    save(im.filter(ImageFilter.GaussianBlur(0.5)), "typed1957.png")


# ───────── 1970s CRT terminal ─────────
def crt():
    W, H = 1400, 1050
    im = Image.new("RGB", (W, H), (2, 10, 4))
    d = ImageDraw.Draw(im)
    g = (70, 255, 140)
    f = font("mono", 30)
    lines = ["PAYROLL SYSTEM  V2.1          05/12/78  09:41", "", "EMP NO   NAME              DEPT   GROSS", "------   ---------------   ----   --------", "004117   ANDERSON, R.      ACCT    1,245.00", "004122   BALDWIN, M.       OPS       982.50", "004135   CHEN, L.          ENG     1,410.75", "004140   DIAZ, F.          SALES   1,102.00", "004158   EVANS, K.         ACCT      998.25", "004163   FOSTER, J.        INV     1,037.00", "", "RECORDS PROCESSED: 1,284      ERRORS: 0", "", "> RUN INVENTORY.UPDATE", "  READING TAPE 07 ...", "> _"]
    y = 60
    for ln in lines:
        d.text((70, y), ln, font=f, fill=g)
        y += 52
    glow = im.filter(ImageFilter.GaussianBlur(6))
    im = Image.blend(im, glow, 0.35)
    a = np.asarray(im).astype(np.float32)
    a[::4] *= 0.55  # scanlines
    a[1::4] *= 0.8
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    a *= np.clip(1.15 - 0.35 * r ** 2, 0, 1)[..., None]
    a[..., 1] += 6
    save(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)), "crt1978.png")
    return (70, 60 + 13 * 52 + 20)  # pixel position of the "READING TAPE" line (thread anchor)


def greenbar():
    W, H = 1600, 1100
    im = Image.new("RGB", (W, H), (238, 242, 234))
    d = ImageDraw.Draw(im)
    for i, y in enumerate(range(0, H, 90)):
        if i % 2 == 0:
            d.rectangle((70, y, W - 70, y + 45), fill=(196, 222, 198))
    for y in range(20, H, 45):
        d.ellipse((20, y, 44, y + 24), fill=(170, 170, 160))
        d.ellipse((W - 44, y, W - 20, y + 24), fill=(170, 170, 160))
    f = font("cour", 24)
    rng = random.Random(6)
    for y in range(20, H - 30, 45):
        s = f"{rng.randint(100000, 999999)}  {rng.choice(['INV', 'ACCT', 'OPS', 'SALES'])}  {rng.randint(10, 9999):>6}.{rng.randint(0, 99):02d}  {rng.choice(['OK', 'OK', 'OK', 'HOLD'])}"
        d.text((100, y + 8), s, font=f, fill=(60, 60, 70))
    save(im.filter(ImageFilter.GaussianBlur(0.6)), "greenbar.png")


# ───────── 1990s spreadsheet ─────────
def spreadsheet():
    W, H = 1400, 1050
    im = Image.new("RGB", (W, H), (192, 192, 192))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 40), fill=(0, 0, 128))
    d.text((16, 6), "Spreadsheet - Q3_REGIONAL.XLS", font=font("sansb", 26), fill=(255, 255, 255))
    for i, t in enumerate(["File", "Edit", "View", "Insert", "Format", "Tools", "Data", "Window", "Help"]):
        d.text((16 + i * 90, 48), t, font=font("sans", 24), fill=(0, 0, 0))
    d.rectangle((10, 120, W - 10, H - 40), fill=(255, 255, 255))
    cols = ["", "A", "B", "C", "D", "E", "F"]
    cw = [50, 260, 170, 170, 170, 170, 170]
    x = 10
    for i, c in enumerate(cols):
        d.rectangle((x, 120, x + cw[i], 150), fill=(212, 208, 200), outline=(128, 128, 128))
        d.text((x + cw[i] / 2, 135), c, font=font("sans", 22), fill=(0, 0, 0), anchor="mm")
        x += cw[i]
    rows = [["Region", "Q1", "Q2", "Q3", "Q4", "Total"], ["Finance", "12,400", "13,150", "14,020", "15,300", "54,870"], ["Operations", "9,860", "10,240", "10,900", "11,760", "42,760"], ["Sales", "22,310", "24,050", "26,480", "29,900", "102,740"], ["Inventory", "7,420", "7,110", "7,980", "8,640", "31,150"], ["Management", "5,200", "5,200", "5,450", "5,450", "21,300"], ["", "", "", "", "", ""], ["Total", "57,190", "59,750", "64,830", "71,050", "252,820"]]
    for r, row in enumerate(rows):
        y = 150 + r * 34
        d.rectangle((10, y, 60, y + 34), fill=(212, 208, 200), outline=(128, 128, 128))
        d.text((35, y + 17), str(r + 1), font=font("sans", 20), fill=(0, 0, 0), anchor="mm")
        x = 60
        for i, v in enumerate(row):
            d.rectangle((x, y, x + cw[i + 1], y + 34), outline=(200, 200, 200))
            fb = font("sansb", 22) if r in (0, 7) or i == 0 else font("sans", 22)
            if i == 0:
                d.text((x + 8, y + 6), v, font=fb, fill=(0, 0, 0))
            else:
                d.text((x + cw[i + 1] - 10, y + 6), v, font=fb, fill=(0, 0, 0), anchor="ra")
            x += cw[i + 1]
    # embedded chart
    cx0, cy0, cx1, cy1 = 110, 470, W - 110, H - 80
    d.rectangle((cx0, cy0, cx1, cy1), fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    d.text((cx0 + 20, cy0 + 12), "Quarterly Total", font=font("sansb", 24), fill=(0, 0, 0))
    for k in range(5):
        yy = cy0 + 70 + k * (cy1 - cy0 - 110) / 4
        d.line((cx0 + 70, yy, cx1 - 30, yy), fill=(210, 210, 210))
    vals = [0.25, 0.4, 0.33, 0.62, 0.55, 0.78, 0.92]
    pts = []
    for i, v in enumerate(vals):
        px = cx0 + 90 + i * (cx1 - cx0 - 150) / (len(vals) - 1)
        py = cy1 - 40 - v * (cy1 - cy0 - 130)
        pts.append((px, py))
    d.line(pts, fill=(0, 0, 160), width=6, joint="curve")
    for p in pts:
        d.rectangle((p[0] - 7, p[1] - 7, p[0] + 7, p[1] + 7), fill=(0, 0, 160))
    save(im, "sheet1996.png")
    return [(x / W, y / H) for x, y in pts]


# ───────── 2000s browser ─────────
def browser():
    W, H = 1600, 1000
    im = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 70), fill=(236, 233, 216))
    d.rounded_rectangle((170, 18, W - 200, 54), radius=6, fill=(255, 255, 255), outline=(127, 157, 185))
    d.text((186, 24), "http://www.northwind-store.example/shop", font=font("lib", 22), fill=(40, 40, 40))
    d.rectangle((0, 70, W, 160), fill=(24, 68, 150))
    d.text((40, 94), "NORTHWIND", font=font("libb", 42), fill=(255, 255, 255))
    for i, t in enumerate(["Home", "Products", "Deals", "Track Order", "Cart (2)"]):
        d.text((620 + i * 190, 106), t, font=font("lib", 26), fill=(220, 230, 255))
    rng = random.Random(8)
    for i in range(4):
        x = 40 + i * 390
        d.rectangle((x, 200, x + 350, 560), fill=(240, 243, 248), outline=(210, 214, 222))
        c = [(200, 120, 60), (60, 120, 200), (90, 160, 90), (170, 80, 150)][i]
        d.rounded_rectangle((x + 60, 230, x + 290, 440), radius=20, fill=c)
        d.text((x + 20, 460), ["Leather Satchel", "Desk Lamp", "Travel Mug", "Headphones"][i], font=font("libb", 26), fill=(30, 30, 30))
        d.text((x + 20, 500), f"${rng.randint(19, 149)}.99", font=font("lib", 26), fill=(180, 40, 30))
        d.rounded_rectangle((x + 200, 500, x + 330, 540), radius=6, fill=(255, 153, 0))
        d.text((x + 265, 520), "Add to Cart", font=font("libb", 18), fill=(0, 0, 0), anchor="mm")
    d.rectangle((40, 600, W - 40, 900), fill=(245, 245, 245))
    d.text((60, 620), "Ships worldwide  ·  Secure checkout  ·  Order tracking", font=font("lib", 28), fill=(80, 80, 80))
    for k in range(5):
        d.rectangle((60, 680 + k * 40, 60 + rng.randint(500, 1300), 700 + k * 40), fill=(220, 220, 220))
    save(im, "browser2005.png")


# ───────── 2010s–2020s dashboards ─────────
def dashboard(name, W=1600, H=1000, dark=True, accent=(90, 220, 255), seed=1, title="Overview"):
    rng = random.Random(seed)
    bg = (12, 20, 36) if dark else (245, 247, 250)
    card = (22, 34, 58) if dark else (255, 255, 255)
    txt = (230, 238, 255) if dark else (30, 40, 60)
    sub = (130, 150, 185) if dark else (120, 130, 150)
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 230, H), fill=(16, 26, 46) if dark else (236, 240, 246))
    for i, t in enumerate(["Overview", "Revenue", "Customers", "Orders", "Inventory", "Reports"]):
        if i == 0:
            d.rounded_rectangle((16, 90 + i * 60, 214, 136 + i * 60), radius=10, fill=(*[int(c * 0.35) for c in accent],))
        d.text((40, 100 + i * 60), t, font=font("ui", 22), fill=txt if i == 0 else sub)
    d.text((270, 30), title, font=font("uim", 38), fill=txt)
    kpis = [("Revenue", f"${rng.randint(180, 420)}k", f"+{rng.randint(4, 28)}%"), ("Orders", f"{rng.randint(1, 9)},{rng.randint(100, 999)}", f"+{rng.randint(2, 15)}%"), ("Customers", f"{rng.randint(10, 60)},{rng.randint(100, 999)}", f"+{rng.randint(1, 9)}%"), ("Avg. response", f"{rng.randint(1, 9)}m {rng.randint(10, 59)}s", f"-{rng.randint(5, 30)}%")]
    for i, (k, v, c) in enumerate(kpis):
        x = 270 + i * 330
        d.rounded_rectangle((x, 110, x + 310, 250), radius=16, fill=card)
        d.text((x + 24, 130), k, font=font("ui", 22), fill=sub)
        d.text((x + 24, 165), v, font=font("uim", 44), fill=txt)
        d.text((x + 220, 180), c, font=font("uim", 22), fill=accent)
    d.rounded_rectangle((270, 280, 1240, 700), radius=16, fill=card)
    d.text((300, 300), "Revenue, last 12 months", font=font("ui", 24), fill=sub)
    pts = []
    v = 0.3
    for i in range(12):
        v = min(0.95, max(0.1, v + rng.uniform(-0.06, 0.13)))
        pts.append((310 + i * 80, 670 - v * 320))
    d.polygon(pts + [(pts[-1][0], 680), (pts[0][0], 680)], fill=tuple(int(c * 0.25 + b * 0.75) for c, b in zip(accent, card)))
    d.line(pts, fill=accent, width=5, joint="curve")
    d.rounded_rectangle((1270, 280, W - 30, 700), radius=16, fill=card)
    d.text((1300, 300), "Channels", font=font("ui", 24), fill=sub)
    for i in range(5):
        wv = rng.randint(80, 260)
        d.rounded_rectangle((1300, 360 + i * 64, 1300 + wv, 390 + i * 64), radius=8, fill=accent if i == 0 else tuple(int(c * 0.6) for c in accent))
    d.rounded_rectangle((270, 730, W - 30, H - 30), radius=16, fill=card)
    for i in range(4):
        y = 760 + i * 50
        d.text((300, y), ["#10482  Order confirmed", "#10481  Invoice sent", "#10479  Payment received", "#10477  Ticket resolved"][i], font=font("ui", 22), fill=txt)
        d.text((W - 200, y), f"{rng.randint(1, 59)} min ago", font=font("ui", 20), fill=sub)
    save(im, name)
    return [(x / W, y / H) for x, y in pts]


def phone_screen(name, notifications=0, dark=True, accent=(90, 220, 255)):
    W, H = 720, 1480
    im = Image.new("RGB", (W, H), (10, 16, 30) if dark else (245, 247, 250))
    d = ImageDraw.Draw(im)
    d.text((40, 30), "9:41", font=font("uim", 34), fill=(230, 238, 255))
    if notifications:
        for i in range(notifications):
            y = 140 + i * 150
            d.rounded_rectangle((30, y, W - 30, y + 130), radius=28, fill=(38, 48, 72))
            d.ellipse((56, y + 30, 116, y + 90), fill=[(255, 90, 100), (90, 180, 255), (255, 190, 70), (120, 220, 140)][i % 4])
            d.text((140, y + 26), ["CRM", "Inbox", "Invoices", "Chat", "Ads", "Helpdesk", "Payroll"][i % 7], font=font("uim", 30), fill=(240, 240, 255))
            d.text((140, y + 72), ["3 new leads assigned", "12 unread messages", "Invoice #2291 overdue", "Can you check this?", "Budget 80% spent", "Ticket escalated", "Approval needed"][i % 7], font=font("ui", 24), fill=(170, 180, 205))
    else:
        d.text((40, 120), "Sales today", font=font("ui", 30), fill=(150, 170, 200))
        d.text((40, 170), "$12,480", font=font("uim", 80), fill=(240, 246, 255))
        pts = [(40 + i * 60, 520 - random.Random(i).uniform(0, 200) - i * 10) for i in range(11)]
        d.line(pts, fill=accent, width=6)
        for i in range(4):
            d.rounded_rectangle((40, 620 + i * 150, W - 40, 740 + i * 150), radius=24, fill=(26, 38, 64))
    save(im, name)


def city_night(name="city_night.png", W=4000, H=1400, seed=3):
    rng = np.random.default_rng(seed)
    im = np.zeros((H, W, 3), np.float32)
    sky = np.linspace(0, 1, H)[:, None]
    im[..., 0] = 10 + 30 * sky
    im[..., 1] = 14 + 30 * sky
    im[..., 2] = 38 + 40 * sky
    x = 0
    while x < W:
        bw = int(rng.integers(60, 220))
        bh = int(rng.integers(180, 1150))
        top = H - bh
        im[top:, x:x + bw] = (8, 10, 18)
        for wy in range(top + 12, H - 10, 22):
            for wx in range(x + 8, x + bw - 8, 16):
                if rng.random() < 0.45:
                    c = rng.choice([0, 1, 2])
                    col = [(255, 210, 140), (220, 235, 255), (255, 240, 200)][c]
                    im[wy:wy + 10, wx:wx + 8] = np.array(col) * rng.uniform(0.35, 1.0)
        x += bw + int(rng.integers(0, 30))
    # distant lights haze
    img = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8))
    glow = img.filter(ImageFilter.GaussianBlur(12))
    img = Image.blend(img, glow, 0.25)
    img.save(os.path.join(OUT, name))


def org_chart():
    W, H = 1200, 800
    im = Image.new("RGB", (W, H), (226, 222, 210))
    d = ImageDraw.Draw(im)
    ink = (40, 40, 40)
    d.text((W // 2, 50), "ORGANIZATION CHART", font=font("serif", 44), fill=ink, anchor="mm")
    def boxc(cx, cy, t):
        d.rectangle((cx - 120, cy - 36, cx + 120, cy + 36), outline=ink, width=3)
        d.text((cx, cy), t, font=font("serif", 28), fill=ink, anchor="mm")
    boxc(600, 160, "PRESIDENT")
    d.line((600, 196, 600, 250), fill=ink, width=3)
    d.line((200, 250, 1000, 250), fill=ink, width=3)
    for i, t in enumerate(["FINANCE", "SALES", "OPERATIONS"]):
        cx = 200 + i * 400
        d.line((cx, 250, cx, 300), fill=ink, width=3)
        boxc(cx, 336, t)
        d.line((cx, 372, cx, 430), fill=ink, width=3)
        d.line((cx - 110, 430, cx + 110, 430), fill=ink, width=3)
        for j in (-1, 1):
            d.line((cx + j * 110, 430, cx + j * 110, 470), fill=ink, width=3)
            d.rectangle((cx + j * 110 - 80, 470, cx + j * 110 + 80, 530), outline=ink, width=2)
    save(im, "orgchart.png")


def clock_face(name="clock.png"):
    S = 800
    im = Image.new("RGB", (S, S), (236, 230, 214))
    d = ImageDraw.Draw(im)
    c = S / 2
    for i in range(60):
        a = i * math.pi / 30
        r0 = 330 if i % 5 else 300
        d.line((c + r0 * math.sin(a), c - r0 * math.cos(a), c + 360 * math.sin(a), c - 360 * math.cos(a)), fill=(30, 30, 30), width=10 if i % 5 == 0 else 4)
    for i in range(1, 13):
        a = i * math.pi / 6
        d.text((c + 240 * math.sin(a), c - 240 * math.cos(a)), str(i), font=font("serif", 70), fill=(30, 30, 30), anchor="mm")
    d.line((c, c, c + 150 * math.sin(math.radians(300)), c - 150 * math.cos(math.radians(300))), fill=(20, 20, 20), width=18)
    d.line((c, c, c + 250 * math.sin(math.radians(60)), c - 250 * math.cos(math.radians(60))), fill=(20, 20, 20), width=12)
    save(im, name)


def keycaps(name="keys.png", color=(222, 214, 196), legend=(60, 60, 60)):
    im = Image.new("RGB", (512, 512), color)
    save(im, name)


if __name__ == "__main__":
    ledger1400()
    printed1750()
    accountbook()
    accountbook("ledger1924.png", "1924", seed=5, headers=True, base=(240, 234, 214))
    typed_memo()
    crt()
    greenbar()
    import json
    anchors = {"sheet": spreadsheet()}
    browser()
    anchors["cloud"] = dashboard("dash_cloud.png", accent=(120, 230, 255), seed=2, title="Overview")
    anchors["auto1"] = dashboard("dash_auto1.png", accent=(90, 140, 255), seed=3, title="Pipeline")
    dashboard("dash_auto2.png", accent=(255, 170, 80), seed=4, title="Campaigns")
    dashboard("dash_auto3.png", accent=(120, 220, 150), seed=5, title="Inventory")
    dashboard("dash_auto4.png", accent=(255, 110, 130), seed=6, title="Support")
    dashboard("dash_light.png", dark=False, accent=(40, 120, 255), seed=7, title="Finance")
    phone_screen("phone_app.png")
    phone_screen("phone_notif.png", notifications=7)
    city_night()
    org_chart()
    clock_face()
    json.dump(anchors, open(os.path.join(OUT, "anchors.json"), "w"))
    print("ok")
