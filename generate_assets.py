import math
import os
from PIL import Image, ImageDraw, ImageFilter

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_canvas(w, h, scale=4):
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    return img, draw, scale

def save_scaled(img, filename, target_size):
    res = img.resize(target_size, Image.Resampling.LANCZOS)
    path = os.path.join(ASSETS_DIR, filename)
    res.save(path, "PNG")
    print(f"Rendered High-Res: {path}")

# Helper: radial gradient sphere / circle
def draw_shaded_circle(draw, cx, cy, r, base_col, light_col, dark_col, scale):
    steps = 14
    for i in range(steps, 0, -1):
        ratio = i / steps
        cr = r * ratio
        # Shift light source up-left
        ox = cx - (r - cr) * 0.35
        oy = cy - (r - cr) * 0.35
        col = tuple(
            int(base_col[k] + (light_col[k] - base_col[k]) * (1 - ratio) if ratio < 0.6 
                else base_col[k] - (base_col[k] - dark_col[k]) * ratio)
            for k in range(3)
        )
        alpha = base_col[3] if len(base_col) > 3 else 255
        draw.ellipse([ox - cr, oy - cr, ox + cr, oy + cr], fill=col + (alpha,))

# ==========================================
# 1. HERO CATS
# ==========================================

def draw_beautiful_cat(filename, body_col, dark_shade, light_tint, eye_col, fur_type="barsik"):
    w, h = 64, 64
    img, d, s = create_canvas(w, h)
    
    # 1. Soft contact shadow on ground
    d.ellipse([10*s, 48*s, 54*s, 60*s], fill=(0, 0, 0, 75))
    
    # 2. Tail with fluffy tip
    tail_pts = [(16*s, 44*s), (8*s, 38*s), (4*s, 26*s), (8*s, 16*s), (14*s, 18*s), (10*s, 28*s), (16*s, 38*s)]
    d.polygon(tail_pts, fill=body_col)
    d.ellipse([4*s, 14*s, 14*s, 24*s], fill=light_tint)
    
    # 3. Fluffy Body
    d.ellipse([14*s, 24*s, 50*s, 54*s], fill=dark_shade)
    d.ellipse([15*s, 22*s, 49*s, 52*s], fill=body_col)
    # Fluffy belly highlight
    d.ellipse([22*s, 32*s, 42*s, 50*s], fill=light_tint + (220,))

    # 4. Cute Paws
    # Back paws
    d.ellipse([14*s, 46*s, 26*s, 56*s], fill=dark_shade)
    d.ellipse([15*s, 45*s, 25*s, 54*s], fill=light_tint)
    d.ellipse([38*s, 46*s, 50*s, 56*s], fill=dark_shade)
    d.ellipse([39*s, 45*s, 49*s, 54*s], fill=light_tint)
    # Pink paw pads
    d.ellipse([18*s, 48*s, 22*s, 52*s], fill=(255, 140, 160))
    d.ellipse([42*s, 48*s, 46*s, 52*s], fill=(255, 140, 160))

    # 5. Head
    d.ellipse([12*s, 10*s, 52*s, 44*s], fill=dark_shade)
    d.ellipse([13*s, 9*s, 51*s, 42*s], fill=body_col)

    # 6. Ears (with inner pink & fur tufts)
    # Left ear
    d.polygon([(16*s, 22*s), (12*s, 4*s), (28*s, 14*s)], fill=dark_shade)
    d.polygon([(17*s, 20*s), (14*s, 6*s), (27*s, 14*s)], fill=body_col)
    d.polygon([(18*s, 18*s), (16*s, 9*s), (25*s, 15*s)], fill=(255, 160, 175))
    # Ear white fluff
    d.polygon([(17*s, 16*s), (22*s, 14*s), (20*s, 18*s)], fill=(255, 255, 255, 200))

    # Right ear
    d.polygon([(48*s, 22*s), (52*s, 4*s), (36*s, 14*s)], fill=dark_shade)
    d.polygon([(47*s, 20*s), (50*s, 6*s), (37*s, 14*s)], fill=body_col)
    d.polygon([(46*s, 18*s), (48*s, 9*s), (39*s, 15*s)], fill=(255, 160, 175))
    d.polygon([(47*s, 16*s), (42*s, 14*s), (44*s, 18*s)], fill=(255, 255, 255, 200))

    # 7. Accessories by hero
    if fur_type == "barsik":
        # Crimson Red Ninja Headband with flowing ribbon
        d.rectangle([13*s, 16*s, 51*s, 23*s], fill=(160, 20, 30))
        d.rectangle([13*s, 17*s, 51*s, 22*s], fill=(230, 40, 50))
        # Golden Crest in center of headband
        d.ellipse([29*s, 16*s, 35*s, 22*s], fill=(255, 215, 0))
        d.ellipse([30*s, 17*s, 34*s, 21*s], fill=(255, 245, 160))
        # Flowing ribbons
        d.polygon([(50*s, 18*s), (62*s, 12*s), (56*s, 22*s)], fill=(200, 25, 35))
        d.polygon([(50*s, 20*s), (60*s, 24*s), (54*s, 28*s)], fill=(180, 20, 30))
    elif fur_type == "murzik":
        # Midnight Ninja Band & Golden Shuriken broach
        d.rectangle([13*s, 16*s, 51*s, 22*s], fill=(20, 20, 30))
        d.polygon([(32*s, 15*s), (34*s, 19*s), (38*s, 19*s), (35*s, 22*s), (36*s, 26*s), (32*s, 23*s), (28*s, 26*s), (29*s, 22*s), (26*s, 19*s), (30*s, 19*s)], fill=(255, 215, 0))
        d.polygon([(50*s, 17*s), (63*s, 14*s), (57*s, 23*s)], fill=(30, 30, 45))
    elif fur_type == "pukhlyash":
        # Golden bell collar with red ribbon
        d.arc([16*s, 32*s, 48*s, 44*s], start=0, end=180, fill=(220, 40, 50), width=4*s)
        d.ellipse([28*s, 39*s, 36*s, 47*s], fill=(255, 215, 0))
        d.ellipse([29*s, 40*s, 35*s, 46*s], fill=(255, 235, 100))
        d.ellipse([31*s, 44*s, 33*s, 46*s], fill=(60, 40, 20))

    # 8. Big Expressive Anime Chibi Eyes
    # Sclera / eye shape
    d.ellipse([18*s, 22*s, 30*s, 35*s], fill=(20, 25, 35))
    d.ellipse([34*s, 22*s, 46*s, 35*s], fill=(20, 25, 35))
    # Iris gradient
    d.ellipse([19*s, 23*s, 29*s, 34*s], fill=eye_col)
    d.ellipse([35*s, 23*s, 45*s, 34*s], fill=eye_col)
    # Pupil
    d.ellipse([21*s, 25*s, 27*s, 32*s], fill=(15, 15, 20))
    d.ellipse([37*s, 25*s, 43*s, 32*s], fill=(15, 15, 20))
    # Multiple sparkle highlights
    d.ellipse([21*s, 24*s, 25*s, 28*s], fill=(255, 255, 255))
    d.ellipse([26*s, 30*s, 28*s, 32*s], fill=(255, 255, 255, 220))
    d.ellipse([37*s, 24*s, 41*s, 28*s], fill=(255, 255, 255))
    d.ellipse([42*s, 30*s, 44*s, 32*s], fill=(255, 255, 255, 220))

    # 9. Nose & Mouth
    d.polygon([(30*s, 34*s), (34*s, 34*s), (32*s, 37*s)], fill=(255, 130, 160))
    d.arc([27*s, 35*s, 32*s, 40*s], start=0, end=180, fill=(70, 45, 35), width=2*s)
    d.arc([32*s, 35*s, 37*s, 40*s], start=0, end=180, fill=(70, 45, 35), width=2*s)

    # 10. Cute Blush
    d.ellipse([14*s, 32*s, 20*s, 36*s], fill=(255, 100, 130, 100))
    d.ellipse([44*s, 32*s, 50*s, 36*s], fill=(255, 100, 130, 100))

    # 11. Whiskers
    for wy in [33, 36]:
        d.line([8*s, (wy-1)*s, 20*s, wy*s], fill=(60, 40, 30, 150), width=1*s)
        d.line([56*s, (wy-1)*s, 44*s, wy*s], fill=(60, 40, 30, 150), width=1*s)

    save_scaled(img, filename, (w, h))

draw_beautiful_cat("cat_barsik.png", (250, 150, 45), (200, 100, 20), (255, 235, 205), (46, 204, 113), "barsik")
draw_beautiful_cat("cat_murzik.png", (45, 48, 60), (25, 25, 35), (100, 105, 125), (241, 196, 15), "murzik")
draw_beautiful_cat("cat_pukhlyash.png", (248, 248, 252), (210, 215, 225), (255, 255, 255), (52, 152, 219), "pukhlyash")

# ==========================================
# 2. ENEMIES
# ==========================================

# Zombie Mouse
def draw_beautiful_mouse():
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    d.ellipse([8*s, 38*s, 40*s, 46*s], fill=(0, 0, 0, 60))
    # Tail
    d.arc([4*s, 24*s, 20*s, 42*s], start=90, end=270, fill=(110, 145, 90), width=3*s)
    # Body
    d.ellipse([12*s, 16*s, 38*s, 40*s], fill=(120, 165, 95))
    d.ellipse([14*s, 18*s, 36*s, 38*s], fill=(145, 190, 115))
    # Big round ears with zombie bite
    d.ellipse([8*s, 8*s, 22*s, 22*s], fill=(110, 150, 85))
    d.ellipse([10*s, 10*s, 20*s, 20*s], fill=(140, 110, 120))
    # Right torn ear
    d.ellipse([26*s, 8*s, 40*s, 22*s], fill=(110, 150, 85))
    d.polygon([(34*s, 6*s), (38*s, 14*s), (32*s, 12*s)], fill=(0, 0, 0, 0)) # bite notch
    # Glowing evil eyes
    d.ellipse([17*s, 20*s, 25*s, 29*s], fill=(230, 30, 30))
    d.ellipse([27*s, 20*s, 35*s, 29*s], fill=(230, 30, 30))
    d.ellipse([19*s, 22*s, 23*s, 26*s], fill=(255, 230, 100))
    d.ellipse([29*s, 22*s, 33*s, 26*s], fill=(255, 230, 100))
    # Sharp tiny fangs
    d.polygon([(21*s, 33*s), (23*s, 37*s), (25*s, 33*s)], fill=(255, 255, 240))
    d.polygon([(27*s, 33*s), (29*s, 37*s), (31*s, 33*s)], fill=(255, 255, 240))
    save_scaled(img, "enemy_mouse.png", (w, h))

draw_beautiful_mouse()

# Zombie Dog
def draw_beautiful_dog():
    w, h = 56, 56
    img, d, s = create_canvas(w, h)
    d.ellipse([10*s, 44*s, 46*s, 54*s], fill=(0, 0, 0, 70))
    # Body
    d.ellipse([12*s, 18*s, 44*s, 46*s], fill=(110, 105, 95))
    d.ellipse([14*s, 20*s, 42*s, 44*s], fill=(140, 135, 125))
    # Spiked leather collar
    d.rectangle([14*s, 28*s, 42*s, 34*s], fill=(40, 40, 45))
    for sx in [16, 22, 28, 34, 40]:
        d.polygon([(sx*s, 28*s), ((sx+2)*s, 24*s), ((sx+4)*s, 28*s)], fill=(225, 225, 235))
    # Head & Floppy ears
    d.ellipse([14*s, 8*s, 42*s, 32*s], fill=(140, 135, 125))
    d.ellipse([8*s, 12*s, 18*s, 28*s], fill=(95, 90, 80))
    d.ellipse([38*s, 12*s, 48*s, 28*s], fill=(95, 90, 80))
    # Menacing glowing eyes
    d.ellipse([18*s, 14*s, 26*s, 22*s], fill=(255, 50, 20))
    d.ellipse([30*s, 14*s, 38*s, 22*s], fill=(255, 50, 20))
    d.ellipse([21*s, 16*s, 24*s, 20*s], fill=(255, 240, 120))
    d.ellipse([33*s, 16*s, 36*s, 20*s], fill=(255, 240, 120))
    # Snout & Fangs & Toxic drool
    d.ellipse([20*s, 20*s, 36*s, 31*s], fill=(90, 85, 75))
    d.ellipse([25*s, 21*s, 31*s, 26*s], fill=(30, 25, 25))
    d.polygon([(23*s, 29*s), (25*s, 35*s), (27*s, 29*s)], fill=(255, 255, 240))
    d.polygon([(29*s, 29*s), (31*s, 35*s), (33*s, 29*s)], fill=(255, 255, 240))
    d.ellipse([24*s, 34*s, 27*s, 41*s], fill=(80, 230, 60))
    save_scaled(img, "enemy_dog.png", (w, h))

draw_beautiful_dog()

# Zombie Cucumber (Legendary Screaming Pickle)
def draw_beautiful_cucumber():
    w, h = 50, 50
    img, d, s = create_canvas(w, h)
    d.ellipse([12*s, 40*s, 38*s, 48*s], fill=(0, 0, 0, 60))
    # Pickled green shaded curved body
    d.rounded_rectangle([15*s, 6*s, 35*s, 42*s], radius=10*s, fill=(35, 120, 50))
    d.rounded_rectangle([16*s, 7*s, 34*s, 41*s], radius=9*s, fill=(50, 165, 70))
    # Dark pimples / bumps
    bumps = [(19, 11), (30, 14), (21, 21), (29, 27), (18, 33), (31, 36)]
    for bx, by in bumps:
        d.ellipse([(bx-2)*s, (by-2)*s, (bx+2)*s, (by+2)*s], fill=(25, 95, 40))
        d.ellipse([(bx-1)*s, (by-1)*s, (bx+1)*s, (by+1)*s], fill=(15, 65, 25))
    # Screaming wild cartoon face
    d.ellipse([16*s, 12*s, 26*s, 23*s], fill=(255, 255, 255))
    d.ellipse([25*s, 11*s, 34*s, 21*s], fill=(255, 255, 255))
    d.ellipse([19*s, 15*s, 24*s, 20*s], fill=(220, 20, 20))
    d.ellipse([27*s, 13*s, 31*s, 18*s], fill=(220, 20, 20))
    # Screaming gaping mouth with monster teeth
    d.ellipse([19*s, 24*s, 31*s, 35*s], fill=(30, 10, 15))
    for tx in [21, 25, 29]:
        d.polygon([(tx*s, 24*s), ((tx+2)*s, 28*s), ((tx+4)*s, 24*s)], fill=(255, 255, 240))
    # Flailing arms
    d.arc([6*s, 18*s, 18*s, 30*s], start=120, end=320, fill=(45, 150, 60), width=4*s)
    d.arc([32*s, 18*s, 44*s, 30*s], start=220, end=60, fill=(45, 150, 60), width=4*s)
    save_scaled(img, "enemy_cucumber.png", (w, h))

draw_beautiful_cucumber()

# Zombie Pigeon
def draw_beautiful_pigeon():
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    # Wing Left
    d.polygon([(24*s, 22*s), (2*s, 8*s), (10*s, 28*s)], fill=(70, 80, 85))
    d.polygon([(24*s, 22*s), (5*s, 11*s), (11*s, 25*s)], fill=(110, 150, 105))
    # Wing Right
    d.polygon([(24*s, 22*s), (46*s, 8*s), (38*s, 28*s)], fill=(70, 80, 85))
    d.polygon([(24*s, 22*s), (43*s, 11*s), (37*s, 25*s)], fill=(110, 150, 105))
    # Body
    d.ellipse([17*s, 16*s, 31*s, 36*s], fill=(100, 110, 115))
    d.ellipse([19*s, 18*s, 29*s, 34*s], fill=(125, 135, 140))
    # Head & Glowing Eyes
    d.ellipse([19*s, 9*s, 29*s, 20*s], fill=(120, 130, 135))
    d.ellipse([19*s, 12*s, 23*s, 16*s], fill=(255, 30, 30))
    d.ellipse([25*s, 12*s, 29*s, 16*s], fill=(255, 30, 30))
    d.ellipse([20*s, 13*s, 22*s, 15*s], fill=(255, 230, 100))
    d.ellipse([26*s, 13*s, 28*s, 15*s], fill=(255, 230, 100))
    # Beak
    d.polygon([(23*s, 16*s), (25*s, 16*s), (24*s, 22*s)], fill=(245, 175, 25))
    save_scaled(img, "enemy_pigeon.png", (w, h))

draw_beautiful_pigeon()

# Boss 1: Robot Vacuum Cleaner
def draw_beautiful_vacuum():
    w, h = 80, 80
    img, d, s = create_canvas(w, h)
    d.ellipse([8*s, 48*s, 72*s, 76*s], fill=(0, 0, 0, 95))
    # High-tech circular body with rim
    d.ellipse([8*s, 10*s, 72*s, 68*s], fill=(30, 32, 42))
    d.ellipse([11*s, 13*s, 69*s, 65*s], fill=(55, 60, 75))
    d.ellipse([16*s, 18*s, 64*s, 60*s], fill=(38, 42, 54))
    # Caution hazard stripes on bumper
    for ang in range(20, 170, 25):
        rad = math.radians(ang)
        x = 40 + math.cos(rad) * 26
        y = 39 + math.sin(rad) * 26
        d.ellipse([(x-3)*s, (y-3)*s, (x+3)*s, (y+3)*s], fill=(255, 200, 20))
    # Central HAL-9000 Menacing Eye
    d.ellipse([28*s, 27*s, 52*s, 51*s], fill=(20, 10, 15))
    d.ellipse([30*s, 29*s, 50*s, 49*s], fill=(160, 15, 25))
    d.ellipse([34*s, 33*s, 46*s, 45*s], fill=(255, 40, 40))
    d.ellipse([37*s, 36*s, 43*s, 42*s], fill=(255, 230, 230))
    # Spiked intake teeth
    d.arc([18*s, 46*s, 62*s, 64*s], start=0, end=180, fill=(15, 15, 20), width=6*s)
    for tx in [24, 30, 36, 42, 48, 54]:
        d.polygon([(tx*s, 52*s), ((tx+2)*s, 60*s), ((tx+4)*s, 52*s)], fill=(255, 255, 255))
    save_scaled(img, "boss_vacuum.png", (w, h))

draw_beautiful_vacuum()

# Boss 2: General Meatgrinder (Bulldozer)
def draw_beautiful_bulldozer():
    w, h = 96, 96
    img, d, s = create_canvas(w, h)
    d.ellipse([8*s, 62*s, 88*s, 92*s], fill=(0, 0, 0, 100))
    # Heavy Treadmills with gears
    d.rounded_rectangle([10*s, 54*s, 86*s, 78*s], radius=8*s, fill=(28, 28, 34))
    d.rounded_rectangle([14*s, 58*s, 82*s, 74*s], radius=6*s, fill=(45, 48, 55))
    for wx in [20, 34, 48, 62, 76]:
        d.ellipse([(wx-5)*s, 61*s, (wx+5)*s, 71*s], fill=(75, 80, 92))
        d.ellipse([(wx-2)*s, 64*s, (wx+2)*s, 68*s], fill=(20, 20, 25))
    # Armored Heavy Cabin
    d.rounded_rectangle([18*s, 20*s, 78*s, 58*s], radius=8*s, fill=(90, 30, 35))
    d.rounded_rectangle([22*s, 24*s, 74*s, 54*s], radius=6*s, fill=(140, 45, 55))
    # Glowing evil skull grill
    d.ellipse([34*s, 28*s, 62*s, 48*s], fill=(25, 15, 20))
    d.ellipse([38*s, 32*s, 46*s, 41*s], fill=(255, 30, 30))
    d.ellipse([50*s, 32*s, 58*s, 41*s], fill=(255, 30, 30))
    d.ellipse([46*s, 38*s, 50*s, 43*s], fill=(255, 120, 120))
    # Huge Spiked Dozer Blade
    d.polygon([(8*s, 64*s), (88*s, 64*s), (94*s, 84*s), (2*s, 84*s)], fill=(45, 45, 50))
    d.polygon([(10*s, 66*s), (86*s, 66*s), (90*s, 82*s), (6*s, 82*s)], fill=(180, 35, 40))
    for sx in [12, 26, 40, 54, 68, 82]:
        d.polygon([((sx-4)*s, 82*s), ((sx+4)*s, 82*s), (sx*s, 94*s)], fill=(235, 235, 245))
        d.polygon([((sx-2)*s, 82*s), (sx*s, 92*s), (sx*s, 82*s)], fill=(255, 255, 255))
    save_scaled(img, "boss_bulldozer.png", (w, h))

draw_beautiful_bulldozer()

# ==========================================
# 3. WEAPONS & PROJECTILES
# ==========================================

# Fish Boomerang
def draw_beautiful_fish():
    w, h = 32, 32
    img, d, s = create_canvas(w, h)
    # Shaded curved fish body
    d.chord([4*s, 6*s, 26*s, 26*s], start=0, end=360, fill=(50, 140, 230))
    d.ellipse([6*s, 8*s, 24*s, 24*s], fill=(90, 195, 255))
    d.ellipse([8*s, 10*s, 20*s, 20*s], fill=(160, 230, 255))
    # Tail & Dorsal Fin
    d.polygon([(22*s, 16*s), (30*s, 6*s), (28*s, 26*s)], fill=(255, 175, 40))
    d.polygon([(14*s, 6*s), (18*s, 2*s), (22*s, 7*s)], fill=(255, 175, 40))
    # Cute Eye
    d.ellipse([9*s, 12*s, 14*s, 17*s], fill=(255, 255, 255))
    d.ellipse([10*s, 13*s, 13*s, 16*s], fill=(20, 30, 60))
    d.ellipse([10*s, 13*s, 11*s, 14*s], fill=(255, 255, 255))
    save_scaled(img, "proj_fish.png", (w, h))

draw_beautiful_fish()

# Yarn Ball
def draw_beautiful_yarn():
    w, h = 32, 32
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 16*s, 16*s, 12*s, (230, 45, 95), (255, 130, 170), (160, 20, 60), s)
    # Woven strands
    d.arc([5*s, 5*s, 27*s, 27*s], start=30, end=210, fill=(255, 160, 190), width=3*s)
    d.arc([7*s, 9*s, 25*s, 23*s], start=120, end=330, fill=(190, 25, 75), width=2*s)
    d.arc([10*s, 5*s, 22*s, 27*s], start=0, end=180, fill=(255, 185, 215), width=2*s)
    # Flowing string tail
    d.arc([20*s, 20*s, 31*s, 31*s], start=180, end=360, fill=(240, 60, 110), width=2*s)
    save_scaled(img, "proj_yarn.png", (w, h))

draw_beautiful_yarn()

# Flying Slipper (Bunny slipper)
def draw_beautiful_slipper():
    w, h = 32, 32
    img, d, s = create_canvas(w, h)
    # Sole
    d.rounded_rectangle([4*s, 12*s, 28*s, 24*s], radius=6*s, fill=(50, 140, 220))
    d.rounded_rectangle([6*s, 14*s, 26*s, 22*s], radius=4*s, fill=(90, 185, 255))
    # Fluffy bunny front
    d.ellipse([16*s, 8*s, 28*s, 22*s], fill=(255, 255, 255))
    # Bunny ears
    d.ellipse([18*s, 2*s, 22*s, 10*s], fill=(255, 255, 255))
    d.ellipse([19*s, 4*s, 21*s, 8*s], fill=(255, 160, 180))
    d.ellipse([23*s, 2*s, 27*s, 10*s], fill=(255, 255, 255))
    d.ellipse([24*s, 4*s, 26*s, 8*s], fill=(255, 160, 180))
    save_scaled(img, "proj_slipper.png", (w, h))

draw_beautiful_slipper()

# Laser Sparkle
def draw_beautiful_laser():
    w, h = 32, 32
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 16*s, 16*s, 10*s, (255, 50, 80), (255, 255, 255), (200, 10, 40), s)
    d.line([2*s, 16*s, 30*s, 16*s], fill=(255, 220, 230), width=3*s)
    d.line([16*s, 2*s, 16*s, 30*s], fill=(255, 220, 230), width=3*s)
    save_scaled(img, "proj_laser.png", (w, h))

draw_beautiful_laser()

# Purr Aura Wave
def draw_beautiful_aura():
    w, h = 64, 64
    img, d, s = create_canvas(w, h)
    d.ellipse([4*s, 4*s, 60*s, 60*s], outline=(100, 225, 255, 180), width=4*s)
    d.ellipse([10*s, 10*s, 54*s, 54*s], outline=(180, 245, 255, 140), width=3*s)
    for ang in range(0, 360, 60):
        rad = math.radians(ang)
        x = 32 + math.cos(rad) * 26
        y = 32 + math.sin(rad) * 26
        d.ellipse([(x-3)*s, (y-3)*s, (x+3)*s, (y+3)*s], fill=(130, 240, 255, 220))
    save_scaled(img, "aura_wave.png", (w, h))

draw_beautiful_aura()

# ==========================================
# 4. SUPER WEAPON EVOLUTIONS
# ==========================================

# Evo 1: Golden Shark
def draw_beautiful_evo_shark():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    # Golden shark body
    d.chord([4*s, 8*s, 30*s, 28*s], start=0, end=360, fill=(255, 205, 30))
    d.ellipse([6*s, 10*s, 26*s, 26*s], fill=(255, 235, 100))
    d.polygon([(26*s, 18*s), (34*s, 4*s), (32*s, 32*s)], fill=(230, 165, 15))
    d.polygon([(16*s, 8*s), (22*s, 1*s), (24*s, 8*s)], fill=(230, 165, 15))
    # Glowing Ruby Eye
    d.ellipse([9*s, 12*s, 14*s, 17*s], fill=(255, 20, 40))
    d.ellipse([10*s, 13*s, 12*s, 15*s], fill=(255, 255, 255))
    save_scaled(img, "evo_shark.png", (w, h))

draw_beautiful_evo_shark()

# Evo 2: Plasma Web
def draw_beautiful_evo_web():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    d.ellipse([4*s, 4*s, 32*s, 32*s], outline=(0, 240, 255), width=2*s)
    d.ellipse([10*s, 10*s, 26*s, 26*s], outline=(0, 240, 255), width=2*s)
    d.line([2*s, 18*s, 34*s, 18*s], fill=(160, 255, 255), width=2*s)
    d.line([18*s, 2*s, 18*s, 34*s], fill=(160, 255, 255), width=2*s)
    d.line([6*s, 6*s, 30*s, 30*s], fill=(160, 255, 255), width=2*s)
    d.line([6*s, 30*s, 30*s, 6*s], fill=(160, 255, 255), width=2*s)
    for px, py in [(18, 4), (32, 18), (18, 32), (4, 18)]:
        d.ellipse([(px-2)*s, (py-2)*s, (px+2)*s, (py+2)*s], fill=(255, 255, 255))
    save_scaled(img, "evo_web.png", (w, h))

draw_beautiful_evo_web()

# Evo 3: Sacred Meow Dome
def draw_beautiful_evo_dome():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 18*s, 18*s, 14*s, (255, 215, 0), (255, 255, 220), (210, 150, 10), s)
    d.ellipse([10*s, 10*s, 26*s, 26*s], fill=(255, 255, 255))
    # Sacred cross cat paw
    d.ellipse([15*s, 15*s, 21*s, 21*s], fill=(255, 200, 30))
    d.ellipse([13*s, 13*s, 16*s, 16*s], fill=(255, 200, 30))
    d.ellipse([20*s, 13*s, 23*s, 16*s], fill=(255, 200, 30))
    save_scaled(img, "evo_dome.png", (w, h))

draw_beautiful_evo_dome()

# Evo 4: Orbital Beam MEOW-1
def draw_beautiful_evo_beam():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    # Satellite core
    draw_shaded_circle(d, 18*s, 18*s, 8*s, (240, 40, 70), (255, 180, 200), (160, 10, 30), s)
    # Solar panels
    d.rectangle([2*s, 14*s, 10*s, 22*s], fill=(40, 140, 220))
    d.rectangle([26*s, 14*s, 34*s, 22*s], fill=(40, 140, 220))
    # Laser emitter glint
    d.ellipse([16*s, 16*s, 20*s, 20*s], fill=(255, 255, 255))
    save_scaled(img, "evo_beam.png", (w, h))

draw_beautiful_evo_beam()

# Evo 5: Grandma's Slipper Barrage
def draw_beautiful_evo_barrage():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    # Golden and Crimson dual heavy slippers
    d.rounded_rectangle([4*s, 6*s, 22*s, 18*s], radius=4*s, fill=(230, 45, 55))
    d.rounded_rectangle([14*s, 18*s, 32*s, 30*s], radius=4*s, fill=(255, 215, 0))
    # Angel wings on slippers
    d.polygon([(2*s, 8*s), (6*s, 4*s), (8*s, 10*s)], fill=(255, 255, 255))
    d.polygon([(28*s, 26*s), (34*s, 22*s), (32*s, 28*s)], fill=(255, 255, 255))
    save_scaled(img, "evo_barrage.png", (w, h))

draw_beautiful_evo_barrage()

# ==========================================
# 5. DROPS & ITEMS
# ==========================================

# Lucky Mystery Chest
def draw_beautiful_chest():
    w, h = 36, 36
    img, d, s = create_canvas(w, h)
    d.ellipse([4*s, 26*s, 32*s, 34*s], fill=(0, 0, 0, 75))
    # Chest base (carved oak & gold)
    d.rounded_rectangle([5*s, 13*s, 31*s, 29*s], radius=3*s, fill=(140, 75, 20))
    d.rounded_rectangle([6*s, 14*s, 30*s, 28*s], radius=2*s, fill=(185, 110, 35))
    # Golden reinforced corners
    d.rectangle([5*s, 13*s, 9*s, 29*s], fill=(255, 215, 0))
    d.rectangle([27*s, 13*s, 31*s, 29*s], fill=(255, 215, 0))
    # Curved Golden Lid
    d.rounded_rectangle([3*s, 6*s, 33*s, 16*s], radius=5*s, fill=(255, 215, 0))
    d.rounded_rectangle([5*s, 8*s, 31*s, 14*s], radius=3*s, fill=(255, 240, 130))
    # Royal Ruby Gem Lock
    d.polygon([(18*s, 12*s), (22*s, 17*s), (18*s, 22*s), (14*s, 17*s)], fill=(230, 25, 45))
    d.polygon([(18*s, 14*s), (20*s, 17*s), (18*s, 20*s), (16*s, 17*s)], fill=(255, 160, 180))
    save_scaled(img, "drop_chest.png", (w, h))

draw_beautiful_chest()

# Fishbone XP
def draw_beautiful_fishbone():
    w, h = 24, 24
    img, d, s = create_canvas(w, h)
    d.line([3*s, 12*s, 20*s, 12*s], fill=(100, 240, 255), width=2*s)
    d.polygon([(1*s, 7*s), (7*s, 12*s), (1*s, 17*s)], fill=(160, 250, 255))
    for rx in [9, 13, 17]:
        d.line([rx*s, 6*s, rx*s, 18*s], fill=(120, 245, 255), width=2*s)
    d.polygon([(20*s, 12*s), (23*s, 7*s), (23*s, 17*s)], fill=(160, 250, 255))
    save_scaled(img, "drop_xp.png", (w, h))

draw_beautiful_fishbone()

# Gold Coin with Cat Paw
def draw_beautiful_coin():
    w, h = 24, 24
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 12*s, 12*s, 10*s, (245, 185, 20), (255, 245, 140), (195, 125, 10), s)
    d.ellipse([4*s, 4*s, 20*s, 20*s], outline=(255, 225, 80), width=1*s)
    # Embossed cat paw
    d.ellipse([9*s, 11*s, 15*s, 17*s], fill=(190, 115, 10))
    d.ellipse([7*s, 8*s, 9*s, 10*s], fill=(190, 115, 10))
    d.ellipse([10*s, 7*s, 12*s, 9*s], fill=(190, 115, 10))
    d.ellipse([13*s, 7*s, 15*s, 9*s], fill=(190, 115, 10))
    d.ellipse([16*s, 8*s, 18*s, 10*s], fill=(190, 115, 10))
    save_scaled(img, "drop_coin.png", (w, h))

draw_beautiful_coin()

# Gourmet Sausage (Heal)
def draw_beautiful_sausage():
    w, h = 28, 28
    img, d, s = create_canvas(w, h)
    # Juicy plump sausage
    d.rounded_rectangle([3*s, 9*s, 25*s, 19*s], radius=5*s, fill=(210, 50, 50))
    d.rounded_rectangle([4*s, 10*s, 24*s, 18*s], radius=4*s, fill=(245, 90, 90))
    # Grill marks
    d.line([8*s, 11*s, 11*s, 17*s], fill=(140, 20, 20), width=2*s)
    d.line([14*s, 11*s, 17*s, 17*s], fill=(140, 20, 20), width=2*s)
    d.line([20*s, 11*s, 23*s, 17*s], fill=(140, 20, 20), width=2*s)
    # Twine ties at ends
    d.line([2*s, 14*s, 3*s, 14*s], fill=(255, 240, 200), width=2*s)
    d.line([25*s, 14*s, 26*s, 14*s], fill=(255, 240, 200), width=2*s)
    save_scaled(img, "drop_heal.png", (w, h))

draw_beautiful_sausage()

# Cat Bomb
def draw_beautiful_bomb():
    w, h = 28, 28
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 14*s, 15*s, 10*s, (45, 48, 55), (120, 125, 140), (25, 25, 30), s)
    # Burning fuse & spark
    d.line([14*s, 5*s, 18*s, 2*s], fill=(190, 145, 90), width=2*s)
    d.ellipse([17*s, 1*s, 21*s, 5*s], fill=(255, 215, 40))
    d.ellipse([18*s, 2*s, 20*s, 4*s], fill=(255, 60, 20))
    # Cat paw emblem on bomb
    d.ellipse([12*s, 14*s, 16*s, 18*s], fill=(255, 200, 50))
    d.ellipse([11*s, 12*s, 13*s, 14*s], fill=(255, 200, 50))
    d.ellipse([15*s, 12*s, 17*s, 14*s], fill=(255, 200, 50))
    save_scaled(img, "drop_bomb.png", (w, h))

draw_beautiful_bomb()

# Freeze Clock
def draw_beautiful_clock():
    w, h = 28, 28
    img, d, s = create_canvas(w, h)
    # Bells
    d.ellipse([3*s, 2*s, 9*s, 8*s], fill=(130, 215, 255))
    d.ellipse([19*s, 2*s, 25*s, 8*s], fill=(130, 215, 255))
    # Clock body & face
    draw_shaded_circle(d, 14*s, 15*s, 10*s, (55, 140, 235), (170, 230, 255), (30, 85, 165), s)
    d.ellipse([6*s, 7*s, 22*s, 23*s], fill=(245, 252, 255))
    # Hands & Icicle
    d.line([14*s, 15*s, 14*s, 9*s], fill=(25, 60, 120), width=2*s)
    d.line([14*s, 15*s, 18*s, 15*s], fill=(25, 60, 120), width=2*s)
    save_scaled(img, "drop_clock.png", (w, h))

draw_beautiful_clock()

# Dust particle
def draw_beautiful_dust():
    w, h = 16, 16
    img, d, s = create_canvas(w, h)
    d.ellipse([2*s, 2*s, 14*s, 14*s], fill=(245, 245, 245, 190))
    d.ellipse([4*s, 4*s, 12*s, 12*s], fill=(255, 255, 255, 245))
    save_scaled(img, "fx_dust.png", (w, h))

draw_beautiful_dust()

# Lush Arena Floor Tile
def draw_beautiful_floor():
    w, h = 64, 64
    img, d, s = create_canvas(w, h)
    # Lush vibrant green ground
    d.rectangle([0, 0, w*s, h*s], fill=(72, 175, 78))
    # Grass patches
    d.rectangle([0, 0, 32*s, 32*s], fill=(76, 182, 82))
    d.rectangle([32*s, 32*s, 64*s, 64*s], fill=(69, 168, 74))
    # Scattered cute flowers
    def flower(fx, fy):
        d.ellipse([(fx-2)*s, fy*s, fx*s, (fy+2)*s], fill=(255, 255, 255, 200))
        d.ellipse([(fx+2)*s, fy*s, (fx+4)*s, (fy+2)*s], fill=(255, 255, 255, 200))
        d.ellipse([fx*s, (fy-2)*s, (fx+2)*s, fy*s], fill=(255, 255, 255, 200))
        d.ellipse([fx*s, (fy+2)*s, (fx+2)*s, (fy+4)*s], fill=(255, 255, 255, 200))
        d.ellipse([fx*s, fy*s, (fx+2)*s, (fy+2)*s], fill=(255, 220, 40, 220))

    flower(12, 16)
    flower(46, 42)
    # Subtle cat paw stamp
    d.ellipse([24*s, 44*s, 28*s, 48*s], fill=(62, 150, 68, 120))
    d.ellipse([23*s, 42*s, 24*s, 43*s], fill=(62, 150, 68, 120))
    d.ellipse([25*s, 41*s, 26*s, 42*s], fill=(62, 150, 68, 120))
    d.ellipse([27*s, 41*s, 28*s, 42*s], fill=(62, 150, 68, 120))
    save_scaled(img, "tile_floor.png", (w, h))

draw_beautiful_floor()

# ==========================================
# 6. OBSTACLES & RANGED THREATS
# ==========================================

# Destructible Wooden Crate
def draw_obstacle_crate():
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    # Shadow
    d.ellipse([4*s, 38*s, 44*s, 46*s], fill=(0, 0, 0, 70))
    # Wooden box
    d.rounded_rectangle([4*s, 6*s, 44*s, 42*s], radius=4*s, fill=(130, 80, 35))
    d.rounded_rectangle([6*s, 8*s, 42*s, 40*s], radius=2*s, fill=(165, 105, 50))
    # Planks lines
    d.line([6*s, 19*s, 42*s, 19*s], fill=(110, 65, 25), width=2*s)
    d.line([6*s, 29*s, 42*s, 29*s], fill=(110, 65, 25), width=2*s)
    # Diagonal reinforcement frame
    d.line([8*s, 10*s, 40*s, 38*s], fill=(120, 70, 30), width=4*s)
    d.line([8*s, 38*s, 40*s, 10*s], fill=(120, 70, 30), width=4*s)
    # Iron corners & nails
    for cx in [6, 38]:
        for cy in [8, 36]:
            d.rectangle([cx*s, cy*s, (cx+4)*s, (cy+4)*s], fill=(70, 75, 85))
            d.ellipse([(cx+1)*s, (cy+1)*s, (cx+3)*s, (cy+3)*s], fill=(180, 185, 195))
    # Cat paw stencil on crate
    d.ellipse([21*s, 23*s, 27*s, 28*s], fill=(100, 55, 20, 180))
    d.ellipse([19*s, 20*s, 21*s, 22*s], fill=(100, 55, 20, 180))
    d.ellipse([22*s, 19*s, 24*s, 21*s], fill=(100, 55, 20, 180))
    d.ellipse([25*s, 19*s, 27*s, 21*s], fill=(100, 55, 20, 180))
    d.ellipse([28*s, 20*s, 30*s, 22*s], fill=(100, 55, 20, 180))
    save_scaled(img, "obstacle_crate.png", (w, h))

draw_obstacle_crate()

# Ancient Mossy Boulder
def draw_obstacle_rock():
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    d.ellipse([6*s, 34*s, 42*s, 46*s], fill=(0, 0, 0, 75))
    # Rock shape
    pts = [(10*s, 38*s), (6*s, 24*s), (14*s, 10*s), (32*s, 8*s), (42*s, 18*s), (40*s, 36*s), (24*s, 42*s)]
    d.polygon(pts, fill=(90, 95, 105))
    # Highlights & Facets
    facet1 = [(14*s, 10*s), (32*s, 8*s), (36*s, 24*s), (20*s, 22*s)]
    d.polygon(facet1, fill=(125, 130, 142))
    # Moss green patches
    d.ellipse([10*s, 26*s, 22*s, 36*s], fill=(70, 150, 60))
    d.ellipse([28*s, 12*s, 38*s, 22*s], fill=(70, 150, 60))
    save_scaled(img, "obstacle_rock.png", (w, h))

draw_obstacle_rock()

# Lush Berry Bush
def draw_obstacle_bush():
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    d.ellipse([6*s, 36*s, 42*s, 46*s], fill=(0, 0, 0, 65))
    # Bush leaf clumps
    d.ellipse([6*s, 14*s, 28*s, 38*s], fill=(45, 130, 55))
    d.ellipse([20*s, 14*s, 42*s, 38*s], fill=(50, 140, 60))
    d.ellipse([12*s, 8*s, 36*s, 32*s], fill=(60, 165, 75))
    d.ellipse([16*s, 10*s, 32*s, 28*s], fill=(75, 185, 90))
    # Red berries
    for bx, by in [(16, 20), (28, 18), (22, 26), (34, 25), (14, 28)]:
        d.ellipse([(bx-2)*s, (by-2)*s, (bx+2)*s, (by+2)*s], fill=(235, 45, 55))
        d.ellipse([bx*s, (by-1)*s, (bx+1)*s, by*s], fill=(255, 180, 190))
    save_scaled(img, "obstacle_bush.png", (w, h))

draw_obstacle_bush()

# Ranged Enemy: Zombie Spitter Rat (Throws acid bones / toxic seeds)
def draw_enemy_spitter():
    w, h = 50, 50
    img, d, s = create_canvas(w, h)
    d.ellipse([8*s, 38*s, 42*s, 46*s], fill=(0, 0, 0, 60))
    # Body (purple toxic mutant fur)
    d.ellipse([12*s, 16*s, 38*s, 40*s], fill=(85, 45, 105))
    d.ellipse([14*s, 18*s, 36*s, 38*s], fill=(120, 65, 145))
    # Tail
    d.arc([4*s, 20*s, 18*s, 40*s], start=90, end=270, fill=(75, 35, 90), width=3*s)
    # Spiky toxic ears
    d.polygon([(14*s, 18*s), (10*s, 6*s), (22*s, 14*s)], fill=(120, 65, 145))
    d.polygon([(36*s, 18*s), (40*s, 6*s), (28*s, 14*s)], fill=(120, 65, 145))
    # Toxic glowing yellow/green eyes
    d.ellipse([17*s, 18*s, 25*s, 26*s], fill=(170, 255, 0))
    d.ellipse([27*s, 18*s, 35*s, 26*s], fill=(170, 255, 0))
    d.ellipse([20*s, 20*s, 23*s, 24*s], fill=(25, 25, 25))
    d.ellipse([30*s, 20*s, 33*s, 24*s], fill=(25, 25, 25))
    # Slingshot / Bone launcher in paws
    d.polygon([(32*s, 24*s), (44*s, 18*s), (46*s, 22*s), (36*s, 28*s)], fill=(160, 110, 45))
    d.line([44*s, 18*s, 44*s, 28*s], fill=(220, 220, 220), width=2*s) # elastic band
    d.ellipse([42*s, 22*s, 48*s, 28*s], fill=(120, 240, 40)) # loaded acid ball
    save_scaled(img, "enemy_spitter.png", (w, h))

draw_enemy_spitter()

# Enemy Projectile: Acid Spit Ball
def draw_proj_enemy_acid():
    w, h = 24, 24
    img, d, s = create_canvas(w, h)
    draw_shaded_circle(d, 12*s, 12*s, 8*s, (140, 255, 20), (230, 255, 160), (80, 180, 10), s)
    d.ellipse([5*s, 5*s, 19*s, 19*s], outline=(50, 160, 10), width=1*s)
    # Toxic bubbles
    d.ellipse([8*s, 8*s, 11*s, 11*s], fill=(255, 255, 255, 220))
    save_scaled(img, "proj_enemy_acid.png", (w, h))

draw_proj_enemy_acid()

# 512x512 Masterpiece App Icon for Yandex Games Catalog
def draw_masterpiece_icon():
    w, h = 512, 512
    img = Image.new("RGBA", (w, h), (25, 30, 50))
    d = ImageDraw.Draw(img)
    
    # Radiant comic burst background
    for r in range(360, 0, -6):
        alpha = int(255 * (1 - r / 360))
        d.ellipse([256 - r, 256 - r, 256 + r, 256 + r], fill=(255, 140 + int(r*0.25), 35, 18))
        
    for angle in range(0, 360, 18):
        rad = math.radians(angle)
        rad2 = math.radians(angle + 9)
        p1 = (256, 256)
        p2 = (256 + math.cos(rad) * 450, 256 + math.sin(rad) * 450)
        p3 = (256 + math.cos(rad2) * 450, 256 + math.sin(rad2) * 450)
        d.polygon([p1, p2, p3], fill=(255, 210, 60, 30))

    # Heroic Warrior Cat in center
    # Body
    d.ellipse([136, 215, 376, 455], fill=(200, 100, 20))
    d.ellipse([140, 210, 372, 450], fill=(250, 150, 45))
    d.ellipse([180, 275, 332, 430], fill=(255, 235, 205))
    
    # Head
    d.ellipse([132, 115, 380, 325], fill=(200, 100, 20))
    d.ellipse([136, 110, 376, 320], fill=(250, 150, 45))
    
    # Ears
    d.polygon([(150, 175), (115, 55), (220, 125)], fill=(250, 150, 45))
    d.polygon([(160, 165), (135, 75), (210, 130)], fill=(255, 175, 185))
    d.polygon([(362, 175), (397, 55), (292, 125)], fill=(250, 150, 45))
    d.polygon([(352, 165), (377, 75), (302, 130)], fill=(255, 175, 185))
    
    # Red Ninja Band with Golden Medallion
    d.rectangle([136, 140, 376, 185], fill=(230, 35, 45))
    d.ellipse([236, 142, 276, 182], fill=(255, 215, 0))
    d.ellipse([242, 148, 270, 176], fill=(255, 245, 160))
    d.polygon([(370, 150), (460, 120), (430, 175)], fill=(200, 20, 30))
    d.polygon([(370, 170), (470, 185), (420, 210)], fill=(180, 15, 25))

    # Anime Eyes
    d.ellipse([175, 190, 235, 250], fill=(20, 20, 25))
    d.ellipse([277, 190, 337, 250], fill=(20, 20, 25))
    d.ellipse([185, 195, 225, 240], fill=(46, 204, 113))
    d.ellipse([287, 195, 327, 240], fill=(46, 204, 113))
    d.ellipse([187, 197, 205, 215], fill=(255, 255, 255))
    d.ellipse([289, 197, 307, 215], fill=(255, 255, 255))
    
    # Nose & Mouth
    d.polygon([(246, 250), (266, 250), (256, 265)], fill=(255, 130, 150))
    d.arc([236, 255, 256, 275], start=0, end=180, fill=(40, 30, 20), width=4)
    d.arc([256, 255, 276, 275], start=0, end=180, fill=(40, 30, 20), width=4)

    # Cat holds an epic gleaming Fish Blade
    d.chord([40, 150, 150, 300], start=210, end=30, fill=(60, 170, 255))
    d.polygon([(40, 150), (10, 110), (30, 180)], fill=(255, 180, 40))
    d.ellipse([108, 250, 126, 268], fill=(255, 255, 255))
    d.ellipse([113, 255, 121, 263], fill=(0, 0, 0))

    # Golden border badge
    d.rounded_rectangle([10, 10, 502, 502], radius=40, outline=(255, 215, 0), width=10)

    path = os.path.join(ASSETS_DIR, "icon_512.png")
    img.save(path, "PNG")
    print(f"Rendered High-Res: {path}")

draw_masterpiece_icon()
print("\n=== ALL BEAUTIFUL HD ASSETS SUCCESSFULLY CREATED! ===")
