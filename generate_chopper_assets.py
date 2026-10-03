import os
import math
from PIL import Image, ImageDraw

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_canvas(w, h, scale=4):
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    return img, d, scale

def save_scaled(img, w, h, filename):
    scaled = img.resize((w, h), Image.Resampling.LANCZOS)
    path = os.path.join(ASSETS_DIR, filename)
    scaled.save(path, "PNG")
    print(f"Generated: {path} ({w}x{h})")

# 1. RESCUE CAT CHOPPER ("Борт 9 Жизней") - 96x80
def generate_cat_chopper():
    w, h = 96, 80
    img, d, s = create_canvas(w, h)
    
    # Drop shadow below chopper
    d.ellipse([16*s, 64*s, 80*s, 76*s], fill=(0, 0, 0, 90))
    
    # Chrome Landing Skids
    d.line([(20*s, 56*s), (76*s, 56*s)], fill=(160, 175, 190), width=3*s)
    d.line([(24*s, 48*s), (28*s, 56*s)], fill=(120, 135, 150), width=3*s)
    d.line([(60*s, 48*s), (56*s, 56*s)], fill=(120, 135, 150), width=3*s)
    d.arc([72*s, 48*s, 82*s, 58*s], start=270, end=90, fill=(160, 175, 190), width=3*s) # curved tip
    
    # Rope Ladder hanging down
    for r in range(4):
        ry = 54 + r * 5
        d.line([(32*s, ry*s), (44*s, ry*s)], fill=(180, 130, 70), width=2*s)
    d.line([(32*s, 46*s), (32*s, 72*s)], fill=(130, 90, 45), width=2*s)
    d.line([(44*s, 46*s), (44*s, 72*s)], fill=(130, 90, 45), width=2*s)
    
    # Tail Boom & Tail Fin
    d.polygon([(46*s, 30*s), (88*s, 22*s), (88*s, 28*s), (46*s, 38*s)], fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
    d.polygon([(84*s, 24*s), (92*s, 12*s), (94*s, 14*s), (86*s, 28*s)], fill=(241, 196, 15), outline=(180, 130, 10), width=2*s)
    # Tail rotor blade
    d.line([(90*s, 8*s), (90*s, 24*s)], fill=(220, 230, 240), width=2*s)
    d.circle([(90*s), (16*s)], radius=2*s, fill=(40, 40, 40))
    
    # Main Fuselage (Teal & Gold Rescue Body)
    d.ellipse([14*s, 20*s, 66*s, 52*s], fill=(36, 112, 125), outline=(18, 60, 70), width=2*s)
    # Gold racing stripe
    d.ellipse([16*s, 28*s, 64*s, 44*s], fill=(241, 196, 15), outline=(190, 140, 10), width=1*s)
    d.ellipse([17*s, 32*s, 63*s, 42*s], fill=(36, 112, 125))
    
    # Cat Ears on Chopper Roof! (Aerodynamic ear cowlings)
    d.polygon([(26*s, 22*s), (32*s, 8*s), (38*s, 20*s)], fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
    d.polygon([(28*s, 21*s), (32*s, 11*s), (36*s, 20*s)], fill=(255, 140, 160))
    d.polygon([(44*s, 20*s), (50*s, 8*s), (56*s, 22*s)], fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
    d.polygon([(46*s, 20*s), (50*s, 11*s), (54*s, 21*s)], fill=(255, 140, 160))
    
    # Cockpit Bubble Windshield (with aviator reflections)
    d.ellipse([16*s, 22*s, 38*s, 44*s], fill=(120, 210, 235), outline=(18, 60, 70), width=2*s)
    d.ellipse([18*s, 24*s, 32*s, 36*s], fill=(210, 245, 255, 220)) # Glass glint
    
    # Rescue Searchlight (Glowing yellow cone)
    d.polygon([(22*s, 48*s), (14*s, 66*s), (34*s, 66*s), (26*s, 48*s)], fill=(255, 240, 100, 70))
    d.circle([(24*s), (48*s)], radius=3*s, fill=(255, 255, 200), outline=(150, 150, 80), width=1*s)
    
    # Rotor Mast
    d.rectangle([38*s, 12*s, 42*s, 20*s], fill=(120, 135, 150), outline=(60, 70, 80), width=1*s)
    d.ellipse([34*s, 10*s, 46*s, 15*s], fill=(70, 80, 90))
    
    save_scaled(img, w, h, "cat_chopper.png")

# 2. ROTOR BLADES (96x96 spinning top blade)
def generate_chopper_rotor():
    w, h = 96, 96
    img, d, s = create_canvas(w, h)
    cx, cy = (w // 2) * s, (h // 2) * s
    
    # Spinning blur disc
    d.circle([cx, cy], radius=44*s, fill=(200, 225, 245, 35), outline=(180, 210, 235, 80), width=1*s)
    
    # 2 Main Rotor Blades
    d.line([(cx - 42*s, cy), (cx + 42*s, cy)], fill=(50, 60, 70, 240), width=4*s)
    d.line([(cx - 42*s, cy - 1*s), (cx + 42*s, cy - 1*s)], fill=(241, 196, 15, 220), width=1*s) # Yellow warning tip
    d.line([(cx, cy - 42*s), (cx, cy + 42*s)], fill=(60, 70, 80, 200), width=3*s)
    
    # Rotor Cap
    d.circle([cx, cy], radius=6*s, fill=(30, 35, 45), outline=(150, 160, 175), width=2*s)
    
    save_scaled(img, w, h, "chopper_rotor.png")

# 3. HELIPAD EVACUATION ZONE (110x110)
def generate_helipad():
    w, h = 110, 110
    img, d, s = create_canvas(w, h)
    cx, cy = (w // 2) * s, (h // 2) * s
    
    # Outer Pulsing Danger/Evacuation Ring
    d.circle([cx, cy], radius=52*s, fill=(46, 204, 113, 35), outline=(46, 204, 113, 200), width=3*s)
    
    # Hazard Striped Perimeter Ring
    d.circle([cx, cy], radius=45*s, outline=(241, 196, 15), width=2*s)
    for ang in range(0, 360, 30):
        rad = math.radians(ang)
        x1 = cx + math.cos(rad) * 45 * s
        y1 = cy + math.sin(rad) * 45 * s
        x2 = cx + math.cos(rad) * 52 * s
        y2 = cy + math.sin(rad) * 52 * s
        d.line([(x1, y1), (x2, y2)], fill=(241, 196, 15), width=2*s)
        
    # Inner Dark Landing Pad
    d.circle([cx, cy], radius=38*s, fill=(35, 40, 48, 220), outline=(70, 80, 95), width=2*s)
    
    # Central "H" with Cat Paw Motif!
    # Left pillar
    d.rounded_rectangle([cx - 18*s, cy - 20*s, cx - 10*s, cy + 20*s], radius=2*s, fill=(255, 255, 255))
    # Right pillar
    d.rounded_rectangle([cx + 10*s, cy - 20*s, cx + 18*s, cy + 20*s], radius=2*s, fill=(255, 255, 255))
    # Crossbar
    d.rectangle([cx - 10*s, cy - 5*s, cx + 10*s, cy + 5*s], fill=(255, 255, 255))
    
    # Neon Green Cat Paw in Center of H
    d.ellipse([cx - 6*s, cy - 2*s, cx + 6*s, cy + 8*s], fill=(46, 204, 113))
    for tox, toy in [(-5, -6), (-2, -8), (2, -8), (5, -6)]:
        d.circle([(cx + tox*s), (cy + toy*s)], radius=2*s, fill=(46, 204, 113))
        
    save_scaled(img, w, h, "helipad_zone.png")

if __name__ == "__main__":
    print("Generating Helicopter Evacuation Assets...")
    generate_cat_chopper()
    generate_chopper_rotor()
    generate_helipad()
    print("All Evacuation Assets Generated Successfully!")
