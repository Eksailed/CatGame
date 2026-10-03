import os
import math
from PIL import Image, ImageDraw

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_canvas(w, h, scale=4):
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    return img, d, scale

def assemble_sheet(frames, frame_w, frame_h, filename):
    total_w = frame_w * len(frames)
    sheet = Image.new("RGBA", (total_w, frame_h), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        scaled = f.resize((frame_w, frame_h), Image.Resampling.LANCZOS)
        sheet.paste(scaled, (i * frame_w, 0))
    path = os.path.join(ASSETS_DIR, filename)
    sheet.save(path, "PNG")
    print(f"Created: {path} ({total_w}x{frame_h}, {len(frames)} frames)")

# -------------------------------------------------------------
# 1. BASE VIAL & SPINNING FLIGHT FRAMES (8 Frames: 56x56)
# Crisp apothecary potion bottle: cork, neck, round glass body,
# glowing sloshing emerald valerian liquid with bubbles & glass glints!
# -------------------------------------------------------------
def generate_valerian_spin():
    fw, fh = 56, 56
    frames = []
    
    # 8 rotation steps (0, 45, 90, 135, 180, 225, 270, 315 degrees)
    for idx in range(8):
        angle = idx * 45
        img, d, s = create_canvas(fw, fh)
        cx, cy = 28 * s, 28 * s
        
        # Draw high-res bottle centered at (cx, cy) on supersampled canvas
        bottle_w, bottle_h = 24 * s, 36 * s
        
        # Create unrotated bottle on temporary surface
        tmp = Image.new("RGBA", (fw * s, fh * s), (0, 0, 0, 0))
        td = ImageDraw.Draw(tmp)
        
        # Center of tmp
        tcx, tcy = 28 * s, 28 * s
        
        # Cork stopper
        td.rounded_rectangle([(tcx - 5*s), (tcy - 17*s), (tcx + 5*s), (tcy - 12*s)], radius=2*s, fill=(160, 110, 60), outline=(100, 65, 30), width=1*s)
        # Cork detail lines
        td.line([(tcx - 4*s), (tcy - 15*s), (tcx + 4*s), (tcy - 15*s)], fill=(120, 80, 40), width=1*s)
        
        # Glass Bottle Neck with lip
        td.rectangle([(tcx - 6*s), (tcy - 12*s), (tcx + 6*s), (tcy - 10*s)], fill=(200, 240, 240, 230), outline=(100, 180, 180), width=1*s)
        td.rectangle([(tcx - 4*s), (tcy - 10*s), (tcx + 4*s), (tcy - 4*s)], fill=(180, 230, 230, 210), outline=(80, 160, 160), width=1*s)
        
        # Spherical Glass Bulb Body
        td.ellipse([(tcx - 12*s), (tcy - 6*s), (tcx + 12*s), (tcy + 16*s)], fill=(160, 230, 220, 120), outline=(100, 200, 190), width=2*s)
        
        # Glowing Emerald Valerian Liquid inside (with sloshing level and bubble cycle)
        slosh = math.sin(idx * math.pi / 4) * 3 * s
        td.ellipse([(tcx - 10*s), (tcy - 3*s + slosh), (tcx + 10*s), (tcy + 14*s)], fill=(39, 174, 96, 230))
        td.ellipse([(tcx - 8*s), (tcy + slosh), (tcx + 8*s), (tcy + 13*s)], fill=(46, 204, 113, 240))
        
        # Glowing bubbles inside potion!
        b1_y = tcy + 4*s - ((idx * 2) % 10)*s
        td.ellipse([(tcx - 4*s), b1_y, (tcx - 1*s), b1_y + 3*s], fill=(160, 255, 200, 230))
        b2_y = tcy + 8*s - (((idx + 3) * 2) % 12)*s
        td.ellipse([(tcx + 2*s), b2_y, (tcx + 5*s), b2_y + 3*s], fill=(200, 255, 220, 240))
        
        # Bright curved glass reflection glints
        td.arc([(tcx - 10*s), (tcy - 4*s), (tcx + 10*s), (tcy + 14*s)], start=200, end=270, fill=(255, 255, 255, 220), width=2*s)
        td.ellipse([(tcx - 7*s), (tcy - 1*s), (tcx - 3*s), (tcy + 3*s)], fill=(255, 255, 255, 200))
        
        # Rotate around center
        rotated = tmp.rotate(angle, resample=Image.Resampling.BICUBIC, center=(tcx, tcy))
        frames.append(rotated)
        
        # Also save unrotated frame 0 as proj_valerian.png (48x48 icon)
        if idx == 0:
            icon_img = tmp.resize((48, 48), Image.Resampling.LANCZOS)
            icon_img.save(os.path.join(ASSETS_DIR, "proj_valerian.png"))
            print("Saved icon: assets/proj_valerian.png")
            
    assemble_sheet(frames, fw, fh, "proj_valerian_spin.png")

# -------------------------------------------------------------
# 2. EVOLUTION VIAL: VALERIAN STORM SPIN (8 Frames: 64x64)
# Ornate crystal flask with cosmic purple elixir, gold rune wings!
# -------------------------------------------------------------
def generate_evo_valerian_spin():
    fw, fh = 64, 64
    frames = []
    
    for idx in range(8):
        angle = idx * 45
        tmp = Image.new("RGBA", (fw * 4, fh * 4), (0, 0, 0, 0))
        s = 4
        td = ImageDraw.Draw(tmp)
        tcx, tcy = 32 * s, 32 * s
        
        # Golden Crown Cork Stopper
        td.polygon([(tcx - 6*s, tcy - 20*s), (tcx + 6*s, tcy - 20*s), (tcx + 4*s, tcy - 14*s), (tcx - 4*s, tcy - 14*s)], fill=(255, 215, 0), outline=(180, 140, 0), width=1*s)
        td.ellipse([(tcx - 2*s), (tcy - 23*s), (tcx + 2*s), (tcy - 19*s)], fill=(241, 196, 15))
        
        # Crystal neck
        td.rectangle([(tcx - 5*s), (tcy - 14*s), (tcx + 5*s), (tcy - 6*s)], fill=(220, 200, 240, 220), outline=(140, 100, 180), width=1*s)
        
        # Diamond faceted crystal body
        pts = [
            (tcx, tcy - 8*s),
            (tcx + 14*s, tcy),
            (tcx + 10*s, tcy + 18*s),
            (tcx - 10*s, tcy + 18*s),
            (tcx - 14*s, tcy)
        ]
        td.polygon(pts, fill=(180, 140, 220, 130), outline=(155, 89, 182), width=2*s)
        
        # Cosmic swirling purple liquid inside
        slosh = math.sin(idx * math.pi / 4) * 3 * s
        inner_pts = [
            (tcx, tcy - 4*s + slosh),
            (tcx + 11*s, tcy + 2*s),
            (tcx + 8*s, tcy + 16*s),
            (tcx - 8*s, tcy + 16*s),
            (tcx - 11*s, tcy + 2*s)
        ]
        td.polygon(inner_pts, fill=(142, 68, 173, 240))
        td.ellipse([(tcx - 7*s), (tcy + 3*s), (tcx + 7*s), (tcy + 14*s)], fill=(165, 105, 189, 250))
        
        # Cosmic glowing sparkles inside
        td.ellipse([(tcx - 4*s), (tcy + 5*s), (tcx - 1*s), (tcy + 8*s)], fill=(245, 230, 255))
        td.ellipse([(tcx + 2*s), (tcy + 8*s), (tcx + 5*s), (tcy + 11*s)], fill=(255, 240, 150))
        
        # Crystal facets glint
        td.line([(tcx - 11*s), (tcy + 1*s), (tcx), (tcy + 16*s)], fill=(255, 255, 255, 180), width=2*s)
        td.line([(tcx), (tcy - 6*s), (tcx - 11*s), (tcy + 1*s)], fill=(255, 255, 255, 220), width=2*s)
        
        rotated = tmp.rotate(angle, resample=Image.Resampling.BICUBIC, center=(tcx, tcy))
        frames.append(rotated)
        
    assemble_sheet(frames, fw, fh, "evo_valerian_spin.png")

# -------------------------------------------------------------
# 3. IMPACT SHATTERING SPLASH (8 Frames: 96x96)
# Dynamic explosion of flying glass shards, droplets and ripple!
# -------------------------------------------------------------
def generate_valerian_splash():
    fw, fh = 96, 96
    frames = []
    
    for idx in range(8):
        img, d, s = create_canvas(fw, fh)
        cx, cy = 48 * s, 48 * s
        progress = idx / 7.0
        
        # 1. Ground impact shockwave ring (expands and fades)
        ring_r = int((12 + progress * 32) * s)
        ring_alpha = int((1.0 - progress) * 220)
        d.ellipse([cx - ring_r, cy - int(ring_r * 0.45), cx + ring_r, cy + int(ring_r * 0.45)], outline=(160, 255, 200, ring_alpha), width=max(1, int((3 - progress*2)*s)))
        
        # 2. Bursting droplets flying in all directions
        num_drops = 14
        for d_i in range(num_drops):
            ang = (d_i / num_drops) * 2 * math.pi + (idx * 0.1)
            dist = (10 + progress * 36 + (d_i % 3) * 6) * s
            dx = cx + math.cos(ang) * dist
            dy = cy + math.sin(ang) * (dist * 0.55) - (math.sin(progress * math.pi) * 16 * s) # arc upward
            drop_sz = max(1, int((5 - progress * 3.5) * s))
            drop_alpha = int((1.0 - progress * 0.8) * 255)
            d.ellipse([dx - drop_sz, dy - drop_sz, dx + drop_sz, dy + drop_sz], fill=(46, 204, 113, drop_alpha))
            d.ellipse([dx - drop_sz//2, dy - drop_sz//2, dx, dy], fill=(200, 255, 220, drop_alpha))
            
        # 3. Flying broken glass shards
        num_shards = 8
        for s_i in range(num_shards):
            ang = (s_i / num_shards) * 2 * math.pi + 0.3
            dist = (6 + progress * 40 + (s_i % 2) * 8) * s
            sx = cx + math.cos(ang) * dist
            sy = cy + math.sin(ang) * (dist * 0.6) - (math.sin(progress * math.pi) * 22 * s)
            shard_sz = max(2, int((5 - progress * 3) * s))
            shard_alpha = int((1.0 - progress) * 240)
            d.polygon([(sx, sy - shard_sz), (sx + shard_sz, sy + shard_sz), (sx - shard_sz, sy + shard_sz//2)], fill=(220, 255, 255, shard_alpha), outline=(120, 220, 220, shard_alpha))
            
        # 4. Central splash crown (frames 0 to 3)
        if idx < 4:
            crown_h = int((18 - idx * 4) * s)
            d.ellipse([cx - 16*s, cy - 8*s, cx + 16*s, cy + 8*s], fill=(39, 174, 96, 230))
            d.polygon([(cx - 14*s, cy), (cx - 10*s, cy - crown_h), (cx - 4*s, cy - 4*s), (cx, cy - crown_h - 4*s), (cx + 4*s, cy - 4*s), (cx + 10*s, cy - crown_h), (cx + 14*s, cy)], fill=(46, 204, 113, 220))
            
        frames.append(img)
        
    assemble_sheet(frames, fw, fh, "fx_valerian_splash.png")

# -------------------------------------------------------------
# 4. ANIMATED BUBBLING PUDDLE LOOP (6 Frames: 96x96)
# Fragrant green puddle with continuously popping bubbles & swirls!
# -------------------------------------------------------------
def generate_valerian_puddle_loop():
    fw, fh = 96, 96
    frames = []
    
    # Coordinates of 7 bubbling points
    bubble_spots = [
        (-18, -4), (16, -6), (-6, 8), (14, 6), (-12, 10), (0, -10), (22, 2)
    ]
    
    for idx in range(6):
        img, d, s = create_canvas(fw, fh)
        cx, cy = 48 * s, 48 * s
        phase = idx / 6.0
        
        # Outer shimmering toxic border
        d.ellipse([cx - 42*s, cy - 24*s, cx + 42*s, cy + 24*s], fill=(25, 111, 61, 75))
        d.ellipse([cx - 38*s, cy - 21*s, cx + 38*s, cy + 21*s], fill=(39, 174, 96, 120))
        d.ellipse([cx - 32*s, cy - 17*s, cx + 32*s, cy + 17*s], fill=(46, 204, 113, 160))
        d.ellipse([cx - 22*s, cy - 11*s, cx + 22*s, cy + 11*s], fill=(115, 230, 160, 180))
        
        # Concentric ripple waves
        rip = (idx % 3) * 6 * s
        d.arc([cx - 28*s - rip, cy - 14*s - rip//2, cx + 28*s + rip, cy + 14*s + rip//2], 0, 360, fill=(180, 255, 220, 140 - rip*2), width=1*s)
        
        # Animated popping bubbles!
        for b_idx, (bx, by) in enumerate(bubble_spots):
            b_phase = (phase + b_idx * 0.28) % 1.0
            px = cx + bx * s
            py = cy + by * s
            
            if b_phase < 0.7:
                # Bubble growing
                b_rad = int((2 + b_phase * 6) * s)
                d.ellipse([px - b_rad, py - b_rad, px + b_rad, py + b_rad], fill=(160, 255, 200, 220), outline=(230, 255, 240, 240), width=1*s)
                # Highlight glint
                d.ellipse([px - b_rad + 1*s, py - b_rad + 1*s, px - b_rad//2, py - b_rad//2], fill=(255, 255, 255, 230))
            else:
                # Bubble POP burst droplets!
                pop_p = (b_phase - 0.7) / 0.3
                for p_ang in [0, 90, 180, 270]:
                    rad = math.radians(p_ang)
                    p_dist = (4 + pop_p * 7) * s
                    pdx = px + math.cos(rad) * p_dist
                    pdy = py + math.sin(rad) * p_dist
                    d.circle([pdx, pdy], radius=max(1, int(1.5*s)), fill=(200, 255, 230, int((1.0 - pop_p)*240)))
                    
        frames.append(img)
        
    assemble_sheet(frames, fw, fh, "fx_valerian_puddle_loop.png")

# -------------------------------------------------------------
# 5. ANIMATED VORTEX LOOP (6 Frames: 128x128)
# Giant cosmic valerian storm pulling and swirling!
# -------------------------------------------------------------
def generate_valerian_vortex_loop():
    fw, fh = 128, 128
    frames = []
    
    for idx in range(6):
        img, d, s = create_canvas(fw, fh)
        cx, cy = 64 * s, 64 * s
        base_ang = idx * 60
        
        # Outer nebula glow
        d.ellipse([cx - 58*s, cy - 36*s, cx + 58*s, cy + 36*s], fill=(74, 35, 90, 80))
        d.ellipse([cx - 48*s, cy - 30*s, cx + 48*s, cy + 30*s], fill=(142, 68, 173, 110))
        
        # 4 Swirling spiral arms
        for arm in range(4):
            arm_ang = base_ang + arm * 90
            for r in range(12, 48, 5):
                cur_ang = math.radians(arm_ang + r * 5)
                ax = cx + math.cos(cur_ang) * r * s
                ay = cy + math.sin(cur_ang) * (r * 0.6) * s
                arm_sz = max(1, int((6 - r * 0.08) * s))
                d.ellipse([ax - arm_sz, ay - arm_sz, ax + arm_sz, ay + arm_sz], fill=(215, 189, 226, 180))
                
        # Glowing cosmic center
        d.ellipse([cx - 14*s, cy - 9*s, cx + 14*s, cy + 9*s], fill=(245, 230, 255, 230))
        d.ellipse([cx - 8*s, cy - 5*s, cx + 8*s, cy + 5*s], fill=(255, 255, 255, 255))
        
        frames.append(img)
        
    assemble_sheet(frames, fw, fh, "fx_valerian_vortex_loop.png")

if __name__ == "__main__":
    print("Generating High-Fidelity Valerian Vial Animations...")
    generate_valerian_spin()
    generate_evo_valerian_spin()
    generate_valerian_splash()
    generate_valerian_puddle_loop()
    generate_valerian_vortex_loop()
    print("All Valerian Spritesheets Generated Successfully!")
