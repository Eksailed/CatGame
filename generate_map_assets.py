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

# -------------------------------------------------------------
# 1. SEAMLESS ARENA BASE FLOOR (128x128)
# Lush emerald battleground with subtle warm terracotta pavers,
# soft grass texture, tiny clovers, and rich contrast for enemies!
# -------------------------------------------------------------
def generate_tile_floor():
    w, h = 128, 128
    img, d, s = create_canvas(w, h)
    
    # Base deep emerald lawn color
    d.rectangle([0, 0, w*s, h*s], fill=(45, 92, 42))
    
    # Organic lawn variations (subtle diagonal weave)
    for gx in range(0, w, 16):
        for gy in range(0, h, 16):
            shade = 42 + ((gx * 7 + gy * 13) % 12)
            d.rectangle([gx*s, gy*s, (gx+16)*s, (gy+16)*s], fill=(shade - 4, shade + 48, shade - 6))
            
    # Warm terracotta & sun-baked earth garden pavers (NOT grey so grey enemies never blend!)
    stones = [
        (12, 14, 28, 26), (46, 10, 68, 24), (88, 16, 114, 30),
        (20, 52, 44, 68), (72, 48, 98, 64), (106, 56, 124, 72),
        (8, 92, 34, 110), (52, 88, 76, 106), (92, 94, 118, 116)
    ]
    for x1, y1, x2, y2 in stones:
        # Dark earth mortar
        d.rounded_rectangle([x1*s, y1*s, x2*s, y2*s], radius=4*s, fill=(68, 50, 36), outline=(48, 34, 24), width=1*s)
        # Warm terracotta brick
        d.rounded_rectangle([(x1+2)*s, (y1+2)*s, (x2-2)*s, (y2-2)*s], radius=3*s, fill=(108, 80, 58))
        # Warm amber highlight edge
        d.line([(x1+3)*s, (y1+2)*s, (x2-3)*s, (y1+2)*s], fill=(132, 100, 74), width=1*s)
        
    # Tiny grass blades & clover specks
    for bx in range(4, w, 8):
        for by in range(4, h, 8):
            seed = (bx * 31 + by * 17) % 10
            if seed < 4:
                d.line([bx*s, by*s, (bx+2)*s, (by-4)*s], fill=(95, 175, 75), width=1*s)
                d.line([bx*s, by*s, (bx-2)*s, (by-3)*s], fill=(75, 150, 65), width=1*s)
            elif seed == 5:
                # Golden buttercup flower
                d.circle([(bx*s), (by*s)], radius=2*s, fill=(255, 220, 80))
                
    save_scaled(img, w, h, "tile_floor.png")

# -------------------------------------------------------------
# 2. CENTRAL ROYAL CAT PLAZA (440x440)
# Magnificent warm golden sandstone courtyard with golden cat paw crest!
# (Warm golden/terracotta/slate palette so grey/blue enemies stand out!)
# -------------------------------------------------------------
def generate_map_plaza():
    w, h = 440, 440
    img, d, s = create_canvas(w, h)
    cx, cy = (w // 2) * s, (h // 2) * s
    
    # Outer dark bronze-slate rim
    d.circle([cx, cy], radius=210*s, fill=(42, 38, 46, 230), outline=(28, 24, 32), width=3*s)
    
    # Concentric carved warm sandstone paver rings
    d.circle([cx, cy], radius=195*s, fill=(175, 150, 118), outline=(115, 95, 72), width=2*s)
    d.circle([cx, cy], radius=170*s, fill=(155, 130, 100), outline=(100, 80, 60), width=2*s)
    
    # Radial stone pavers (36 spokes)
    for ang in range(0, 360, 15):
        rad = math.radians(ang)
        x1 = cx + math.cos(rad) * 115 * s
        y1 = cy + math.sin(rad) * 115 * s
        x2 = cx + math.cos(rad) * 190 * s
        y2 = cy + math.sin(rad) * 190 * s
        d.line([(x1, y1), (x2, y2)], fill=(105, 85, 65), width=2*s)
        
    # Inner courtyard tier (warm ivory sandstone)
    d.circle([cx, cy], radius=115*s, fill=(195, 172, 138), outline=(130, 108, 80), width=3*s)
    d.circle([cx, cy], radius=90*s, fill=(215, 192, 158), outline=(150, 128, 98), width=2*s)
    
    # Inner royal dark medallion ring with 24K gold trim
    d.circle([cx, cy], radius=70*s, fill=(45, 40, 52), outline=(218, 165, 32), width=4*s)
    d.circle([cx, cy], radius=62*s, fill=(55, 48, 64))
    
    # Radiant Golden Cat Paw Emblem in Center!
    # Main palm pad
    d.ellipse([cx - 26*s, cy - 8*s, cx + 26*s, cy + 32*s], fill=(255, 205, 30), outline=(190, 140, 10), width=2*s)
    d.ellipse([cx - 22*s, cy - 4*s, cx + 22*s, cy + 28*s], fill=(255, 235, 80))
    # 4 Toe beans
    toe_offsets = [(-22, -22), (-8, -32), (8, -32), (22, -22)]
    for tx, ty in toe_offsets:
        d.ellipse([cx + tx*s - 7*s, cy + ty*s - 9*s, cx + tx*s + 7*s, cy + ty*s + 9*s], fill=(255, 205, 30), outline=(190, 140, 10), width=2*s)
        d.ellipse([cx + tx*s - 5*s, cy + ty*s - 7*s, cx + tx*s + 5*s, cy + ty*s + 7*s], fill=(255, 235, 80))
        
    save_scaled(img, w, h, "map_plaza.png")

# -------------------------------------------------------------
# 3. GUARDIAN CAT MONUMENT / FOUNTAIN (72x72)
# Sacred stone cat fountain with cascading azure water!
# -------------------------------------------------------------
def generate_monument():
    w, h = 72, 72
    img, d, s = create_canvas(w, h)
    cx, cy = 36 * s, 36 * s
    
    # Ground shadow
    d.ellipse([10*s, 54*s, 62*s, 68*s], fill=(0, 0, 0, 75))
    
    # Octagonal Stone Pedestal Base
    d.rounded_rectangle([14*s, 44*s, 58*s, 60*s], radius=4*s, fill=(110, 115, 125), outline=(60, 65, 75), width=2*s)
    d.rectangle([18*s, 36*s, 54*s, 46*s], fill=(140, 145, 155), outline=(80, 85, 95), width=2*s)
    
    # Water basin tier
    d.ellipse([16*s, 30*s, 56*s, 42*s], fill=(41, 128, 185), outline=(21, 80, 130), width=2*s)
    d.ellipse([20*s, 32*s, 52*s, 40*s], fill=(52, 152, 219)) # water reflection
    
    # Golden Cat Statue sitting tall atop monument
    # Body
    d.ellipse([26*s, 16*s, 46*s, 34*s], fill=(218, 165, 32), outline=(160, 110, 15), width=2*s)
    d.ellipse([28*s, 18*s, 44*s, 32*s], fill=(241, 196, 15))
    # Head
    d.ellipse([28*s, 8*s, 44*s, 22*s], fill=(241, 196, 15), outline=(160, 110, 15), width=2*s)
    # Pointy ears
    d.polygon([(29*s, 12*s), (27*s, 2*s), (35*s, 8*s)], fill=(241, 196, 15), outline=(160, 110, 15))
    d.polygon([(43*s, 12*s), (45*s, 2*s), (37*s, 8*s)], fill=(241, 196, 15), outline=(160, 110, 15))
    # Water droplets spouting from statue mouth
    d.line([36*s, 18*s, 36*s, 33*s], fill=(200, 240, 255), width=2*s)
    d.circle([36*s, 33*s], radius=3*s, fill=(255, 255, 255))
    
    save_scaled(img, w, h, "obstacle_monument.png")

# -------------------------------------------------------------
# 4. WEATHERED STONE WALLS (Horizontal 80x32 & Vertical 32x80)
# Heavy masonry blocks with ivy and moss!
# -------------------------------------------------------------
def generate_stone_walls():
    # Horizontal wall (80x32)
    w, h = 80, 32
    img, d, s = create_canvas(w, h)
    # Shadow
    d.rectangle([2*s, 22*s, 78*s, 30*s], fill=(0, 0, 0, 70))
    # Main wall body
    d.rounded_rectangle([2*s, 4*s, 78*s, 24*s], radius=3*s, fill=(100, 105, 115), outline=(50, 55, 60), width=2*s)
    # Brick mortar joints
    for bx in range(16, 70, 18):
        d.line([bx*s, 5*s, bx*s, 14*s], fill=(60, 65, 70), width=1*s)
        d.line([(bx+9)*s, 14*s, (bx+9)*s, 23*s], fill=(60, 65, 70), width=1*s)
    d.line([3*s, 14*s, 77*s, 14*s], fill=(60, 65, 70), width=1*s)
    # Moss / Ivy creeping on bricks
    d.ellipse([10*s, 3*s, 24*s, 10*s], fill=(46, 139, 87))
    d.ellipse([50*s, 2*s, 68*s, 9*s], fill=(46, 139, 87))
    # Top wall coping slab
    d.rectangle([1*s, 2*s, 79*s, 6*s], fill=(135, 140, 150), outline=(80, 85, 95), width=1*s)
    save_scaled(img, w, h, "obstacle_wall_h.png")
    
    # Vertical wall (32x80)
    w, h = 32, 80
    img, d, s = create_canvas(w, h)
    d.rectangle([22*s, 2*s, 30*s, 78*s], fill=(0, 0, 0, 70))
    d.rounded_rectangle([4*s, 2*s, 24*s, 78*s], radius=3*s, fill=(100, 105, 115), outline=(50, 55, 60), width=2*s)
    for by in range(16, 70, 18):
        d.line([5*s, by*s, 14*s, by*s], fill=(60, 65, 70), width=1*s)
        d.line([14*s, (by+9)*s, 23*s, (by+9)*s], fill=(60, 65, 70), width=1*s)
    d.line([14*s, 3*s, 14*s, 77*s], fill=(60, 65, 70), width=1*s)
    d.ellipse([3*s, 18*s, 10*s, 32*s], fill=(46, 139, 87))
    d.rectangle([2*s, 1*s, 26*s, 6*s], fill=(135, 140, 150), outline=(80, 85, 95), width=1*s)
    save_scaled(img, w, h, "obstacle_wall_v.png")

# -------------------------------------------------------------
# 5. OAK FISH BARREL (44x44) (Destructible!)
# Heavy wooden barrel with iron hoops and cat fish emblem!
# -------------------------------------------------------------
def generate_barrel():
    w, h = 44, 44
    img, d, s = create_canvas(w, h)
    cx, cy = 22 * s, 22 * s
    
    d.ellipse([6*s, 32*s, 38*s, 42*s], fill=(0, 0, 0, 65))
    # Barrel curved wooden staves
    d.ellipse([7*s, 6*s, 37*s, 38*s], fill=(160, 100, 50), outline=(90, 50, 25), width=2*s)
    d.ellipse([9*s, 8*s, 35*s, 36*s], fill=(185, 120, 65))
    # Iron hoops
    d.arc([8*s, 12*s, 36*s, 22*s], 0, 180, fill=(60, 65, 75), width=3*s)
    d.arc([8*s, 22*s, 36*s, 32*s], 0, 180, fill=(60, 65, 75), width=3*s)
    # Stave vertical seams
    for sx in [14, 22, 30]:
        d.line([sx*s, 8*s, sx*s, 36*s], fill=(120, 70, 35), width=1*s)
    # Cute painted fish emblem on wood
    d.ellipse([18*s, 18*s, 26*s, 24*s], fill=(255, 230, 120))
    d.polygon([(24*s, 21*s), (28*s, 17*s), (28*s, 25*s)], fill=(255, 230, 120))
    
    save_scaled(img, w, h, "obstacle_barrel.png")

# -------------------------------------------------------------
# 6. RUSTIC WOODEN FENCE (64x24)
# Wooden ranch fencing forming tactical lanes!
# -------------------------------------------------------------
def generate_fence():
    w, h = 64, 24
    img, d, s = create_canvas(w, h)
    d.rectangle([4*s, 16*s, 60*s, 22*s], fill=(0, 0, 0, 55))
    # 2 horizontal rails
    d.rectangle([4*s, 6*s, 60*s, 9*s], fill=(160, 110, 60), outline=(100, 65, 30), width=1*s)
    d.rectangle([4*s, 12*s, 60*s, 15*s], fill=(160, 110, 60), outline=(100, 65, 30), width=1*s)
    # 3 vertical posts with pointed tops
    for px in [8, 32, 56]:
        d.polygon([(px-4)*s, 4*s, px*s, 1*s, (px+4)*s, 4*s, (px+4)*s, 18*s, (px-4)*s, 18*s], fill=(140, 95, 50), outline=(90, 55, 25), width=1*s)
        d.line([px*s, 4*s, px*s, 17*s], fill=(115, 75, 40), width=1*s)
    save_scaled(img, w, h, "obstacle_fence.png")

# -------------------------------------------------------------
# 7. GROUND DECALS: FLOWERS & SEWER MANHOLE (48x48)
# -------------------------------------------------------------
def generate_decals():
    # Wildflowers (48x48)
    w, h = 48, 48
    img, d, s = create_canvas(w, h)
    flower_coords = [
        (14, 16, (231, 76, 60)),   # Red poppy
        (34, 14, (241, 196, 15)),  # Yellow sunflower
        (24, 26, (155, 89, 182)),  # Purple iris
        (12, 34, (52, 152, 219)),  # Blue cornflower
        (36, 32, (255, 255, 255)), # White daisy
    ]
    for fx, fy, col in flower_coords:
        # Green stem & leaf
        d.line([fx*s, (fy+2)*s, fx*s, (fy+8)*s], fill=(39, 174, 96), width=2*s)
        # Petals
        for ang in range(0, 360, 72):
            rad = math.radians(ang)
            px = fx*s + math.cos(rad) * 4*s
            py = fy*s + math.sin(rad) * 4*s
            d.circle([px, py], radius=3*s, fill=col)
        # Center pistil
        d.circle([fx*s, fy*s], radius=2*s, fill=(243, 156, 18))
    save_scaled(img, w, h, "decal_flowers.png")
    
    # Cast Iron Sewer Manhole Cover (48x48)
    img, d, s = create_canvas(w, h)
    cx, cy = 24*s, 24*s
    d.circle([cx, cy], radius=21*s, fill=(45, 50, 55), outline=(25, 30, 35), width=2*s)
    d.circle([cx, cy], radius=18*s, fill=(65, 70, 78), outline=(40, 45, 50), width=1*s)
    # Waffle tread pattern
    for r in range(4, 16, 4):
        d.circle([cx, cy], radius=r*s, outline=(40, 45, 50), width=1*s)
    # Cat paw emblem on iron cover
    d.ellipse([cx - 4*s, cy - 2*s, cx + 4*s, cy + 5*s], fill=(30, 35, 40))
    d.circle([cx - 3*s, cy - 4*s], radius=1*s, fill=(30, 35, 40))
    d.circle([cx, cy - 5*s], radius=1*s, fill=(30, 35, 40))
    d.circle([cx + 3*s, cy - 4*s], radius=1*s, fill=(30, 35, 40))
    save_scaled(img, w, h, "decal_manhole.png")

# -------------------------------------------------------------
# 8. PERIMETER FORTRESS WALL BLOCK (64x36)
# -------------------------------------------------------------
def generate_boundary_wall():
    w, h = 64, 36
    img, d, s = create_canvas(w, h)
    # Heavy stone wall with crenellations
    d.rectangle([0, 8*s, 64*s, 36*s], fill=(70, 75, 85), outline=(35, 40, 45), width=2*s)
    # Crenellation battlements
    d.rectangle([4*s, 0, 24*s, 8*s], fill=(90, 95, 105), outline=(35, 40, 45), width=1*s)
    d.rectangle([40*s, 0, 60*s, 8*s], fill=(90, 95, 105), outline=(35, 40, 45), width=1*s)
    # Stone joints
    d.line([0, 20*s, 64*s, 20*s], fill=(45, 50, 55), width=1*s)
    d.line([32*s, 8*s, 32*s, 20*s], fill=(45, 50, 55), width=1*s)
    d.line([16*s, 20*s, 16*s, 35*s], fill=(45, 50, 55), width=1*s)
    d.line([48*s, 20*s, 48*s, 35*s], fill=(45, 50, 55), width=1*s)
    save_scaled(img, w, h, "boundary_wall.png")

# -------------------------------------------------------------
# 9. CHARACTER & ENEMY DROP SHADOW (48x24)
# Soft elliptical radial gradient shadow that lifts entities off ground
# -------------------------------------------------------------
def generate_shadow():
    w, h = 48, 24
    img, d, s = create_canvas(w, h)
    cx, cy = (w // 2) * s, (h // 2) * s
    for r in range(22, 0, -1):
        # Quadratic smooth falloff
        alpha = int(120 * (1.0 - (r / 22.0)**1.5))
        rx = int(r * 2.1 * s)
        ry = int(r * 1.0 * s)
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(0, 0, 0, alpha))
    save_scaled(img, w, h, "shadow_char.png")

# -------------------------------------------------------------
# 10. ENEMY DANGER THREAT RING (48x26)
# Subtle pulsing red danger marker under enemies for instant detection
# -------------------------------------------------------------
def generate_threat_ring():
    w, h = 48, 26
    img, d, s = create_canvas(w, h)
    cx, cy = (w // 2) * s, (h // 2) * s
    # Outer danger glow
    for r in range(20, 14, -1):
        alpha = int(60 * (1.0 - ((r - 14) / 6.0)))
        d.ellipse([cx - int(r*2.1*s), cy - int(r*1.0*s), cx + int(r*2.1*s), cy + int(r*1.0*s)], outline=(255, 40, 40, alpha), width=1*s)
    # Inner crisp danger ellipse
    d.ellipse([cx - 30*s, cy - 14*s, cx + 30*s, cy + 14*s], fill=(220, 20, 20, 40), outline=(255, 50, 50, 160), width=2*s)
    save_scaled(img, w, h, "enemy_threat_ring.png")

if __name__ == "__main__":
    print("Generating Complete Procedural Map Graphics...")
    generate_tile_floor()
    generate_map_plaza()
    generate_monument()
    generate_stone_walls()
    generate_barrel()
    generate_fence()
    generate_decals()
    generate_boundary_wall()
    generate_shadow()
    generate_threat_ring()
    print("All Map Graphics Generated Successfully!")
