import os
import math
from PIL import Image, ImageDraw

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# Helper: Canvas with supersampling
def create_frame(w, h, scale=4):
    img = Image.new("RGBA", (w * scale, h * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    return img, d, scale

def assemble_spritesheet(frames, frame_w, frame_h, out_filename):
    total_w = frame_w * len(frames)
    sheet = Image.new("RGBA", (total_w, frame_h), (0, 0, 0, 0))
    for idx, f in enumerate(frames):
        scaled = f.resize((frame_w, frame_h), Image.Resampling.LANCZOS)
        sheet.paste(scaled, (idx * frame_w, 0))
    path = os.path.join(ASSETS_DIR, out_filename)
    sheet.save(path, "PNG")
    print(f"Generated Sheet: {path} ({total_w}x{frame_h}, {len(frames)} frames)")
    
    # Also save static fallback frame 0
    static_map = {
        'enemy_mouse_walk.png': 'enemy_mouse.png',
        'enemy_dog_run.png': 'enemy_dog.png',
        'enemy_cucumber_hop.png': 'enemy_cucumber.png',
        'enemy_pigeon_fly.png': 'enemy_pigeon.png',
        'enemy_spitter_walk.png': 'enemy_spitter.png',
        'boss_vacuum_move.png': 'boss_vacuum.png',
        'boss_bulldozer_move.png': 'boss_bulldozer.png'
    }
    if out_filename in static_map:
        static_path = os.path.join(ASSETS_DIR, static_map[out_filename])
        first_frame = frames[0].resize((frame_w, frame_h), Image.Resampling.LANCZOS)
        first_frame.save(static_path, "PNG")
        print(f"Generated Static: {static_path}")

# ========================================================
# 1. CAT RUNNING & IDLE CYCLES (4 run frames, 2 idle frames)
# ========================================================
def generate_cat_sheets(hero_id, body_col, dark_shade, light_tint, eye_col):
    fw, fh = 64, 64
    
    # --- RUN CYCLE (4 frames) ---
    run_frames = []
    # Frame 0: Left paws forward, right paws back, tail up, ribbon wave
    # Frame 1: Low pass crouch, paws gathered, head forward
    # Frame 2: Right paws forward, left paws back, airborne stretch
    # Frame 3: Stride extended, tail sweep, ribbon back
    
    paw_offsets = [
        # (lp_x, lp_y, rp_x, rp_y, body_oy, head_oy, tail_angle, ribbon_wave)
        (-6, 2, 6, -3, 0, 0, 15, 0),
        (0, -2, 0, -2, 2, 2, -10, -5),
        (6, -3, -6, 2, -2, -1, 20, 8),
        (4, 1, -4, 0, 0, 0, 5, 4)
    ]
    
    for f_idx, (lpx, lpy, rpx, rpy, boy, hoy, tail_deg, rib_w) in enumerate(paw_offsets):
        img, d, s = create_frame(fw, fh)
        
        # Ground contact shadow
        d.ellipse([(14 + boy)*s, (50)*s, (50 - boy)*s, (58)*s], fill=(0, 0, 0, 65))
        
        # Tail (animated rotation)
        rad = math.radians(tail_deg)
        tx_end = 8 + math.sin(rad) * 10
        ty_end = 22 + math.cos(rad) * 10
        tail_pts = [(16*s, (42 + boy)*s), (8*s, (36 + boy)*s), (int(tx_end*s), int(ty_end*s)), ((int(tx_end)+6)*s, int(ty_end*s)), (14*s, (36 + boy)*s)]
        d.polygon(tail_pts, fill=body_col)
        d.ellipse([int((tx_end-2)*s), int((ty_end-2)*s), int((tx_end+6)*s), int((ty_end+6)*s)], fill=light_tint)
        
        # Body (squash & tilt during run)
        d.ellipse([(15 + boy)*s, (24 + boy)*s, (49 - boy)*s, (52 + boy)*s], fill=dark_shade)
        d.ellipse([(16 + boy)*s, (23 + boy)*s, (48 - boy)*s, (50 + boy)*s], fill=body_col)
        d.ellipse([(22)*s, (32 + boy)*s, (42)*s, (48 + boy)*s], fill=light_tint + (220,))
        
        # Running Paws (animated forward/backward cycles)
        # Left paws (front/back)
        d.ellipse([(14 + lpx)*s, (44 + lpy)*s, (26 + lpx)*s, (54 + lpy)*s], fill=dark_shade)
        d.ellipse([(15 + lpx)*s, (43 + lpy)*s, (25 + lpx)*s, (52 + lpy)*s], fill=light_tint)
        d.ellipse([(18 + lpx)*s, (46 + lpy)*s, (22 + lpx)*s, (50 + lpy)*s], fill=(255, 140, 160))
        
        # Right paws
        d.ellipse([(38 + rpx)*s, (44 + rpy)*s, (50 + rpx)*s, (54 + rpy)*s], fill=dark_shade)
        d.ellipse([(39 + rpx)*s, (43 + rpy)*s, (49 + rpx)*s, (52 + rpy)*s], fill=light_tint)
        d.ellipse([(42 + rpx)*s, (46 + rpy)*s, (46 + rpx)*s, (50 + rpy)*s], fill=(255, 140, 160))
        
        # Head with bounce
        hy = 10 + hoy
        d.ellipse([12*s, hy*s, 52*s, (hy + 34)*s], fill=dark_shade)
        d.ellipse([13*s, (hy - 1)*s, 51*s, (hy + 32)*s], fill=body_col)
        
        # Ears (with bounce twitch)
        d.polygon([(16*s, (hy + 12)*s), (12*s, (hy - 6)*s), (28*s, (hy + 4)*s)], fill=dark_shade)
        d.polygon([(17*s, (hy + 10)*s), (14*s, (hy - 4)*s), (27*s, (hy + 4)*s)], fill=body_col)
        d.polygon([(18*s, (hy + 8)*s), (16*s, (hy - 1)*s), (25*s, (hy + 5)*s)], fill=(255, 160, 175))
        
        d.polygon([(48*s, (hy + 12)*s), (52*s, (hy - 6)*s), (36*s, (hy + 4)*s)], fill=dark_shade)
        d.polygon([(47*s, (hy + 10)*s), (50*s, (hy - 4)*s), (37*s, (hy + 4)*s)], fill=body_col)
        d.polygon([(46*s, (hy + 8)*s), (48*s, (hy - 1)*s), (39*s, (hy + 5)*s)], fill=(255, 160, 175))
        
        # Hero Headband / Accessory
        if hero_id == "barsik":
            # Flowing Crimson Ninja Band
            d.rectangle([13*s, (hy + 6)*s, 51*s, (hy + 13)*s], fill=(160, 20, 30))
            d.rectangle([13*s, (hy + 7)*s, 51*s, (hy + 12)*s], fill=(230, 40, 50))
            # Gold medallion
            d.ellipse([29*s, (hy + 6)*s, 35*s, (hy + 12)*s], fill=(255, 215, 0))
            # Trailing waving ribbons
            d.polygon([(50*s, (hy + 8)*s), (62*s, (hy + 2 + rib_w)*s), (56*s, (hy + 12 + rib_w)*s)], fill=(220, 35, 45))
        elif hero_id == "murzik":
            d.rectangle([13*s, (hy + 6)*s, 51*s, (hy + 12)*s], fill=(25, 25, 35))
            d.polygon([(32*s, (hy + 5)*s), (35*s, (hy + 9)*s), (39*s, (hy + 9)*s), (36*s, (hy + 12)*s), (37*s, (hy + 16)*s), (32*s, (hy + 13)*s), (27*s, (hy + 16)*s), (28*s, (hy + 12)*s), (25*s, (hy + 9)*s), (29*s, (hy + 9)*s)], fill=(255, 215, 0))
        elif hero_id == "pukhlyash":
            d.ellipse([20*s, (hy + 26)*s, 44*s, (hy + 35)*s], fill=(230, 60, 70))
            d.ellipse([29*s, (hy + 31)*s, 35*s, (hy + 37)*s], fill=(255, 215, 0))
            
        # Eyes (intense running focus)
        d.ellipse([20*s, (hy + 13)*s, 29*s, (hy + 24)*s], fill=(15, 20, 25))
        d.ellipse([35*s, (hy + 13)*s, 44*s, (hy + 24)*s], fill=(15, 20, 25))
        d.ellipse([22*s, (hy + 14)*s, 28*s, (hy + 23)*s], fill=eye_col)
        d.ellipse([37*s, (hy + 14)*s, 43*s, (hy + 23)*s], fill=eye_col)
        # Eye glints
        d.ellipse([23*s, (hy + 15)*s, 26*s, (hy + 18)*s], fill=(255, 255, 255))
        d.ellipse([38*s, (hy + 15)*s, 41*s, (hy + 18)*s], fill=(255, 255, 255))
        
        # Nose & cute muzzle
        d.polygon([(30*s, (hy + 23)*s), (34*s, (hy + 23)*s), (32*s, (hy + 26)*s)], fill=(255, 140, 160))
        d.arc([27*s, (hy + 24)*s, 32*s, (hy + 28)*s], 0, 180, fill=dark_shade, width=2*s)
        d.arc([32*s, (hy + 24)*s, 37*s, (hy + 28)*s], 0, 180, fill=dark_shade, width=2*s)
        
        run_frames.append(img)
    assemble_spritesheet(run_frames, fw, fh, f"cat_{hero_id}_run.png")
    
    # --- IDLE CYCLE (2 frames: breathing & tail swish) ---
    idle_frames = []
    for f_idx, (b_scale, t_angle) in enumerate([(0, 0), (2, 25)]):
        img, d, s = create_frame(fw, fh)
        d.ellipse([(14 - b_scale)*s, 50*s, (50 + b_scale)*s, 58*s], fill=(0, 0, 0, 70))
        # Tail
        rad = math.radians(t_angle)
        tx = 8 + math.sin(rad) * 8
        ty = 22 - math.cos(rad) * 6
        d.polygon([(16*s, 42*s), (8*s, 36*s), (int(tx*s), int(ty*s)), ((int(tx)+6)*s, int(ty*s)), (14*s, 36*s)], fill=body_col)
        # Body
        d.ellipse([(14 - b_scale)*s, (24 - b_scale)*s, (50 + b_scale)*s, 52*s], fill=dark_shade)
        d.ellipse([(15 - b_scale)*s, (23 - b_scale)*s, (49 + b_scale)*s, 50*s], fill=body_col)
        d.ellipse([(22 - b_scale)*s, (32 - b_scale)*s, (42 + b_scale)*s, 48*s], fill=light_tint + (220,))
        # Paws
        d.ellipse([16*s, 46*s, 26*s, 54*s], fill=light_tint)
        d.ellipse([38*s, 46*s, 48*s, 54*s], fill=light_tint)
        # Head
        hy = 10 - b_scale
        d.ellipse([12*s, hy*s, 52*s, (hy + 34)*s], fill=dark_shade)
        d.ellipse([13*s, (hy - 1)*s, 51*s, (hy + 32)*s], fill=body_col)
        # Ears
        d.polygon([(16*s, (hy + 12)*s), (12*s, (hy - 6)*s), (28*s, (hy + 4)*s)], fill=body_col)
        d.polygon([(48*s, (hy + 12)*s), (52*s, (hy - 6)*s), (36*s, (hy + 4)*s)], fill=body_col)
        # Headband
        if hero_id == "barsik":
            d.rectangle([13*s, (hy + 6)*s, 51*s, (hy + 12)*s], fill=(230, 40, 50))
            d.ellipse([29*s, (hy + 6)*s, 35*s, (hy + 12)*s], fill=(255, 215, 0))
        # Eyes
        d.ellipse([22*s, (hy + 14)*s, 28*s, (hy + 23)*s], fill=eye_col)
        d.ellipse([37*s, (hy + 14)*s, 43*s, (hy + 23)*s], fill=eye_col)
        d.ellipse([23*s, (hy + 15)*s, 26*s, (hy + 18)*s], fill=(255, 255, 255))
        d.ellipse([38*s, (hy + 15)*s, 41*s, (hy + 18)*s], fill=(255, 255, 255))
        # Nose
        d.polygon([(30*s, (hy + 23)*s), (34*s, (hy + 23)*s), (32*s, (hy + 26)*s)], fill=(255, 140, 160))
        idle_frames.append(img)
    assemble_spritesheet(idle_frames, fw, fh, f"cat_{hero_id}_idle.png")
    
    # --- HURT FRAME (1 frame) ---
    img_h, dh, s = create_frame(fw, fh)
    # Wincing face (> <), pinned ears, red bruise
    dh.ellipse([14*s, 50*s, 50*s, 58*s], fill=(0, 0, 0, 70))
    dh.ellipse([14*s, 26*s, 50*s, 54*s], fill=dark_shade)
    dh.ellipse([15*s, 25*s, 49*s, 52*s], fill=body_col)
    hy = 14
    dh.ellipse([12*s, hy*s, 52*s, (hy + 34)*s], fill=dark_shade)
    dh.ellipse([13*s, hy*s, 51*s, (hy + 32)*s], fill=body_col)
    # Ears flat
    dh.polygon([(14*s, (hy + 14)*s), (4*s, (hy + 6)*s), (24*s, (hy + 12)*s)], fill=body_col)
    dh.polygon([(50*s, (hy + 14)*s), (60*s, (hy + 6)*s), (40*s, (hy + 12)*s)], fill=body_col)
    # Wincing eyes (> <)
    dh.line([(20*s, (hy + 15)*s), (26*s, (hy + 20)*s)], fill=(30, 20, 20), width=3*s)
    dh.line([(20*s, (hy + 25)*s), (26*s, (hy + 20)*s)], fill=(30, 20, 20), width=3*s)
    dh.line([(44*s, (hy + 15)*s), (38*s, (hy + 20)*s)], fill=(30, 20, 20), width=3*s)
    dh.line([(44*s, (hy + 25)*s), (38*s, (hy + 20)*s)], fill=(30, 20, 20), width=3*s)
    # Open mouth yelling 'MEOW'
    dh.ellipse([28*s, (hy + 24)*s, 36*s, (hy + 31)*s], fill=(180, 40, 50))
    # Headband
    if hero_id == "barsik":
        dh.rectangle([13*s, (hy + 7)*s, 51*s, (hy + 13)*s], fill=(230, 40, 50))
    save_scaled = img_h.resize((fw, fh), Image.Resampling.LANCZOS)
    save_scaled.save(os.path.join(ASSETS_DIR, f"cat_{hero_id}_hurt.png"), "PNG")
    print(f"Generated Hurt Sprite: cat_{hero_id}_hurt.png")

# ========================================================
# 2. ENEMY ANIMATION CYCLES
# ========================================================

# Mouse Scurry Cycle (4 frames: 48x48) - High Contrast & Ink Outline
def generate_mouse_sheet():
    fw, fh = 48, 48
    frames = []
    # (leg_l_offset, leg_r_offset, tail_y, eye_squint)
    steps = [(-5, 5, 0, 0), (0, 0, -6, 1), (5, -5, 4, 0), (0, 0, 6, 1)]
    for f_idx, (lx, rx, ty, eq) in enumerate(steps):
        img, d, s = create_frame(fw, fh)
        d.ellipse([10*s, 36*s, 38*s, 44*s], fill=(0, 0, 0, 85))
        # Tail whipping with dark outline
        d.arc([4*s, (18 + ty)*s, 22*s, (38 + ty)*s], 90, 270, fill=(18, 14, 24), width=4*s)
        d.arc([4*s, (18 + ty)*s, 22*s, (38 + ty)*s], 90, 270, fill=(210, 110, 130), width=2*s)
        # Scurrying Paws with dark outline
        d.ellipse([(13 + lx)*s, 33*s, (21 + lx)*s, 43*s], fill=(18, 14, 24))
        d.ellipse([(14 + lx)*s, 34*s, (20 + lx)*s, 42*s], fill=(240, 160, 170))
        d.ellipse([(27 + rx)*s, 33*s, (35 + rx)*s, 43*s], fill=(18, 14, 24))
        d.ellipse([(28 + rx)*s, 34*s, (34 + rx)*s, 42*s], fill=(240, 160, 170))
        # Body dark ink outline
        d.ellipse([10*s, 14*s, 38*s, 40*s], fill=(18, 14, 24))
        # Body dark slate coat (high contrast against green lawn and golden plaza!)
        d.ellipse([12*s, 16*s, 36*s, 38*s], fill=(55, 60, 75))
        d.ellipse([14*s, 18*s, 34*s, 36*s], fill=(80, 86, 105))
        # Big Ears with dark outline
        d.ellipse([9*s, 7*s, 23*s, 21*s], fill=(18, 14, 24))
        d.ellipse([10*s, 8*s, 22*s, 20*s], fill=(220, 120, 140))
        d.ellipse([25*s, 7*s, 39*s, 21*s], fill=(18, 14, 24))
        d.ellipse([26*s, 8*s, 38*s, 20*s], fill=(220, 120, 140))
        # Glowing Demonic Crimson Red Eyes with Yellow Core! (Instantly spotted!)
        d.ellipse([16*s, 18*s, 24*s, 27*s], fill=(255, 20, 20))
        d.ellipse([24*s, 18*s, 32*s, 27*s], fill=(255, 20, 20))
        d.ellipse([18*s, 20*s, 22*s, 25*s], fill=(255, 235, 60))
        d.ellipse([26*s, 20*s, 30*s, 25*s], fill=(255, 235, 60))
        d.ellipse([19*s, 21*s, 21*s, 23*s], fill=(255, 255, 255))
        d.ellipse([27*s, 21*s, 29*s, 23*s], fill=(255, 255, 255))
        # Snout
        d.ellipse([21*s, 26*s, 27*s, 31*s], fill=(255, 170, 185))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "enemy_mouse_walk.png")

# Dog Gallop Cycle (4 frames: 56x56)
def generate_dog_sheet():
    fw, fh = 56, 56
    frames = []
    # (leg_front_rot, leg_back_rot, jaw_open, ear_flop)
    steps = [(-8, 6, 2, -4), (0, 0, 8, 4), (8, -6, 4, -2), (3, -2, 10, 6)]
    for f_idx, (lx, rx, jaw, ear) in enumerate(steps):
        img, d, s = create_frame(fw, fh)
        d.ellipse([12*s, 44*s, 44*s, 52*s], fill=(0, 0, 0, 85))
        # Paws bounding with outline
        d.ellipse([(13 + lx)*s, 37*s, (23 + lx)*s, 49*s], fill=(25, 18, 14))
        d.ellipse([(14 + lx)*s, 38*s, (22 + lx)*s, 48*s], fill=(70, 50, 40))
        d.ellipse([(33 + rx)*s, 37*s, (43 + rx)*s, 49*s], fill=(25, 18, 14))
        d.ellipse([(34 + rx)*s, 38*s, (42 + rx)*s, 48*s], fill=(70, 50, 40))
        # Dog body with dark ink outline
        d.ellipse([12*s, 18*s, 44*s, 46*s], fill=(25, 18, 14))
        d.ellipse([14*s, 20*s, 42*s, 44*s], fill=(110, 75, 55))
        # Head with dark outline
        d.ellipse([14*s, 8*s, 42*s, 36*s], fill=(25, 18, 14))
        d.ellipse([16*s, 10*s, 40*s, 34*s], fill=(135, 95, 70))
        # Floppy ears
        d.polygon([(14*s, 14*s), ((8 + ear)*s, 26*s), (18*s, 22*s)], fill=(65, 42, 32))
        d.polygon([(38*s, 14*s), ((44 - ear)*s, 26*s), (34*s, 22*s)], fill=(65, 42, 32))
        # Glowing Angry Red Eyes with yellow core
        d.polygon([(19*s, 15*s), (27*s, 21*s), (21*s, 23*s)], fill=(255, 20, 10))
        d.polygon([(37*s, 15*s), (29*s, 21*s), (35*s, 23*s)], fill=(255, 20, 10))
        d.circle([(23*s), (19*s)], radius=1*s, fill=(255, 235, 60))
        d.circle([(33*s), (19*s)], radius=1*s, fill=(255, 235, 60))
        # Snapping Snout & Sharp Teeth
        d.rounded_rectangle([22*s, 22*s, 34*s, (32 + jaw)*s], radius=3*s, fill=(40, 25, 20))
        # White fangs
        d.polygon([(24*s, 26*s), (26*s, (30 + jaw)*s), (28*s, 26*s)], fill=(255, 255, 255))
        d.polygon([(30*s, 26*s), (32*s, (30 + jaw)*s), (34*s, 26*s)], fill=(255, 255, 255))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "enemy_dog_run.png")

# Cucumber Meme Hop Cycle (4 frames: 48x48)
def generate_cucumber_sheet():
    fw, fh = 48, 48
    frames = []
    # (squash_x, stretch_y, arm_angle, pupil_offset)
    steps = [
        (6, -8, 20, 0),   # 0. Squashed anticipation
        (-4, 8, -30, -3),  # 1. Rocket launch stretch
        (-2, 4, 45, 3),   # 2. Apex wobbly airborne
        (4, -4, 0, 0)     # 3. Landing impact
    ]
    for f_idx, (sx, sy, arm_deg, pe) in enumerate(steps):
        img, d, s = create_frame(fw, fh)
        d.ellipse([(14 - sx)*s, 40*s, (34 + sx)*s, 46*s], fill=(0, 0, 0, 70))
        # Cucumber Pickle Body with dark outline
        bx1, by1 = (16 - sx)*s, (8 - sy)*s
        bx2, by2 = (32 + sx)*s, (42)*s
        d.rounded_rectangle([bx1 - 2*s, by1 - 2*s, bx2 + 2*s, by2 + 2*s], radius=9*s, fill=(15, 50, 22))
        d.rounded_rectangle([bx1, by1, bx2, by2], radius=8*s, fill=(45, 155, 60), outline=(25, 95, 35), width=2*s)
        # Pickle warts / bumps
        d.ellipse([(20 - sx)*s, (14 - sy)*s, (24 - sx)*s, (18 - sy)*s], fill=(25, 110, 35))
        d.ellipse([(24 + sx)*s, (24)*s, (28 + sx)*s, (28)*s], fill=(25, 110, 35))
        # Goofy flailing arms
        rad = math.radians(arm_deg)
        ax = math.sin(rad) * 10
        ay = math.cos(rad) * 10
        d.line([(bx1 + 2*s), 24*s, int((bx1 - 6*s - ax*s)), int((24*s + ay*s))], fill=(30, 110, 40), width=4*s)
        d.line([(bx2 - 2*s), 24*s, int((bx2 + 6*s + ax*s)), int((24*s - ay*s))], fill=(30, 110, 40), width=4*s)
        # Big Crazy Meme Eyes with sharp dark border
        d.ellipse([17*s, (13 - sy//2)*s, 27*s, (23 - sy//2)*s], fill=(0, 0, 0))
        d.ellipse([25*s, (12 - sy//2)*s, 35*s, (22 - sy//2)*s], fill=(0, 0, 0))
        d.ellipse([18*s, (14 - sy//2)*s, 26*s, (22 - sy//2)*s], fill=(255, 255, 255))
        d.ellipse([26*s, (13 - sy//2)*s, 34*s, (21 - sy//2)*s], fill=(255, 255, 255))
        d.ellipse([(21 + pe)*s, (17 - sy//2)*s, (24 + pe)*s, (20 - sy//2)*s], fill=(0, 0, 0))
        d.ellipse([(29 - pe)*s, (16 - sy//2)*s, (32 - pe)*s, (19 - sy//2)*s], fill=(0, 0, 0))
        # Shocked 'O' mouth
        d.ellipse([20*s, (25 - sy//2)*s, 30*s, (34 - sy//2)*s], fill=(15, 50, 22))
        d.ellipse([21*s, (26 - sy//2)*s, 29*s, (33 - sy//2)*s], fill=(150, 25, 25))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "enemy_cucumber_hop.png")

# Pigeon Wing Flap Cycle (4 frames: 48x48)
def generate_pigeon_sheet():
    fw, fh = 48, 48
    frames = []
    # (wing_y1, wing_y2, head_bob)
    steps = [(-10, -2, 2), (-2, 6, 0), (8, 14, -2), (0, 4, 1)]
    for f_idx, (wy1, wy2, hb) in enumerate(steps):
        img, d, s = create_frame(fw, fh)
        d.ellipse([16*s, 38*s, 32*s, 44*s], fill=(0, 0, 0, 70))
        # Wings Flapping with Dark Outline
        d.polygon([(24*s, 22*s), (2*s, (19 + wy1)*s), (8*s, (31 + wy2)*s)], fill=(18, 22, 30))
        d.polygon([(24*s, 22*s), (4*s, (20 + wy1)*s), (10*s, (30 + wy2)*s)], fill=(85, 98, 120))
        d.polygon([(24*s, 22*s), (46*s, (19 + wy1)*s), (40*s, (31 + wy2)*s)], fill=(18, 22, 30))
        d.polygon([(24*s, 22*s), (44*s, (20 + wy1)*s), (38*s, (30 + wy2)*s)], fill=(85, 98, 120))
        # Body dark outline
        d.ellipse([14*s, 14*s, 34*s, 38*s], fill=(18, 22, 30))
        d.ellipse([16*s, 16*s, 32*s, 36*s], fill=(95, 108, 130))
        # Glowing iridescent emerald/purple neck collar
        d.ellipse([17*s, 21*s, 31*s, 33*s], fill=(20, 220, 160))
        # Head with dark outline
        d.ellipse([16*s, (8 + hb)*s, 32*s, (24 + hb)*s], fill=(18, 22, 30))
        d.ellipse([18*s, (10 + hb)*s, 30*s, (22 + hb)*s], fill=(110, 125, 150))
        # Fiery glowing orange pigeon eye
        d.ellipse([25*s, (11 + hb)*s, 31*s, (17 + hb)*s], fill=(255, 110, 10))
        d.ellipse([27*s, (13 + hb)*s, 29*s, (15 + hb)*s], fill=(0, 0, 0))
        # Bright Yellow Beak
        d.polygon([(30*s, (14 + hb)*s), (37*s, (17 + hb)*s), (30*s, (20 + hb)*s)], fill=(18, 22, 30))
        d.polygon([(30*s, (15 + hb)*s), (36*s, (17 + hb)*s), (30*s, (19 + hb)*s)], fill=(255, 210, 30))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "enemy_pigeon_fly.png")

# Spitter Acid Cycle (4 frames: 48x48)
def generate_spitter_sheet():
    fw, fh = 48, 48
    frames = []
    # (sac_size, slime_drop_y)
    steps = [(0, 0), (2, 4), (5, 8), (3, 2)]
    for f_idx, (sac, drop) in enumerate(steps):
        img, d, s = create_frame(fw, fh)
        d.ellipse([12*s, 38*s, 36*s, 44*s], fill=(0, 0, 0, 80))
        # Dark Robe with outline
        d.polygon([(14*s, 16*s), (34*s, 16*s), (38*s, 42*s), (10*s, 42*s)], fill=(18, 22, 20))
        d.polygon([(16*s, 18*s), (32*s, 18*s), (36*s, 40*s), (12*s, 40*s)], fill=(40, 50, 45))
        # Head with dark outline
        d.ellipse([14*s, 6*s, 34*s, 26*s], fill=(18, 22, 20))
        d.ellipse([16*s, 8*s, 32*s, 24*s], fill=(60, 95, 70))
        # Swelling Radiant Toxic Acid Throat Sac!
        d.ellipse([(19 - sac)*s, (15 - sac//2)*s, (29 + sac)*s, (27 + sac)*s], fill=(0, 255, 120))
        d.ellipse([(21 - sac)*s, (17 - sac//2)*s, (27 + sac)*s, (25 + sac)*s], fill=(180, 255, 200))
        # Toxic Slime Drip
        if drop > 0:
            d.ellipse([23*s, (26 + drop)*s, 25*s, (29 + drop)*s], fill=(0, 255, 120))
        # Sickly Yellow Glowing Eyes
        d.ellipse([18*s, 11*s, 24*s, 17*s], fill=(255, 230, 0))
        d.ellipse([24*s, 11*s, 30*s, 17*s], fill=(255, 230, 0))
        d.ellipse([20*s, 13*s, 22*s, 15*s], fill=(0, 0, 0))
        d.ellipse([26*s, 13*s, 28*s, 15*s], fill=(0, 0, 0))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "enemy_spitter_walk.png")

# Boss Vacuum Cycle (4 frames: 80x80)
def generate_boss_vacuum_sheet():
    fw, fh = 80, 80
    frames = []
    for f_idx in range(4):
        img, d, s = create_frame(fw, fh)
        d.ellipse([10*s, 54*s, 70*s, 74*s], fill=(0, 0, 0, 80))
        # Round Metallic Vacuum Chassis
        d.ellipse([12*s, 16*s, 68*s, 66*s], fill=(40, 45, 55), outline=(20, 25, 30), width=3*s)
        d.ellipse([16*s, 20*s, 64*s, 62*s], fill=(70, 75, 85))
        # Rotating bottom bristles / brush
        rot_ang = f_idx * 45
        rad = math.radians(rot_ang)
        bx = math.sin(rad) * 16
        by = math.cos(rad) * 16
        d.line([(40 - bx)*s, (41 - by)*s, (40 + bx)*s, (41 + by)*s], fill=(255, 80, 20), width=4*s)
        # Laser LIDAR Turret
        d.ellipse([32*s, 24*s, 48*s, 40*s], fill=(30, 30, 35))
        d.ellipse([36*s, 28*s, 44*s, 36*s], fill=(255, 30, 30) if f_idx % 2 == 0 else (255, 180, 0))
        # Menacing bumper grill
        d.rectangle([22*s, 48*s, 58*s, 56*s], fill=(20, 20, 25))
        # Evil LED headlight eyes
        d.rectangle([26*s, 50*s, 34*s, 54*s], fill=(255, 0, 50))
        d.rectangle([46*s, 50*s, 54*s, 54*s], fill=(255, 0, 50))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "boss_vacuum_move.png")

# Boss Bulldozer Cycle (4 frames: 96x96)
def generate_boss_dozer_sheet():
    fw, fh = 96, 96
    frames = []
    for f_idx in range(4):
        img, d, s = create_frame(fw, fh)
        d.ellipse([12*s, 68*s, 84*s, 88*s], fill=(0, 0, 0, 90))
        # Heavy Steel Tracks
        d.rounded_rectangle([14*s, 56*s, 82*s, 80*s], radius=6*s, fill=(40, 40, 45), outline=(20, 20, 25), width=2*s)
        # Moving Tread Teeth
        offset = (f_idx * 5) % 15
        for tx in range(16, 80, 12):
            d.line([(tx + offset)*s, 58*s, (tx + offset)*s, 78*s], fill=(20, 20, 25), width=2*s)
        # Yellow Industrial Cab
        d.rectangle([24*s, 28*s, 72*s, 58*s], fill=(241, 196, 15), outline=(180, 140, 10), width=2*s)
        # Smoky Exhaust Stack with animated smoke puff
        d.rectangle([62*s, 14*s, 68*s, 30*s], fill=(50, 50, 55))
        puff_y = 12 - f_idx * 3
        d.ellipse([60*s, (puff_y)*s, (72 + f_idx*2)*s, (puff_y + 8)*s], fill=(120, 120, 130, 180 - f_idx*40))
        # Giant Spiked Scoop Blade in front
        d.polygon([(10*s, 44*s), (24*s, 48*s), (24*s, 74*s), (10*s, 78*s)], fill=(120, 125, 135))
        # Spikes
        for sp in [46, 56, 66]:
            d.polygon([(10*s, sp*s), (2*s, (sp + 4)*s), (10*s, (sp + 8)*s)], fill=(230, 235, 245))
        frames.append(img)
    assemble_spritesheet(frames, fw, fh, "boss_bulldozer_move.png")

# ========================================================
# 3. NEW SKILLS & EVOLUTION SPRITES
# ========================================================
def generate_new_skill_sprites():
    # 1. Whirlwind Claws projectile (48x48)
    w, h = 48, 48
    img, d, s = create_frame(w, h)
    for off in [-6, 0, 6]:
        d.arc([(8 + off)*s, 8*s, (40 + off)*s, 40*s], start=180, end=330, fill=(255, 230, 100), width=3*s)
        d.arc([(9 + off)*s, 9*s, (39 + off)*s, 39*s], start=185, end=325, fill=(255, 255, 255), width=2*s)
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "proj_claw_slash.png"))
    
    # 2. Wolverine Evolution Claws (54x54)
    w, h = 54, 54
    img, d, s = create_frame(w, h)
    # Red & gold razor dual X-slash
    for sign in [-1, 1]:
        d.arc([8*s, 8*s, 46*s, 46*s], start=160, end=340, fill=(255, 50, 50), width=4*s)
        d.arc([10*s, 10*s, 44*s, 44*s], start=165, end=335, fill=(255, 215, 0), width=2*s)
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "evo_wolverine.png"))
    
    # 3. Valerian Flask (40x40)
    w, h = 40, 40
    img, d, s = create_frame(w, h)
    # Glass bottle neck
    d.rounded_rectangle([16*s, 6*s, 24*s, 16*s], radius=2*s, fill=(180, 200, 220, 200), outline=(120, 140, 160), width=2*s)
    d.rectangle([14*s, 4*s, 26*s, 7*s], fill=(160, 110, 60)) # cork
    # Flask spherical body with glowing purple potion
    d.ellipse([8*s, 14*s, 32*s, 38*s], fill=(142, 68, 173), outline=(180, 200, 220), width=2*s)
    d.ellipse([11*s, 18*s, 29*s, 35*s], fill=(187, 107, 217))
    d.ellipse([14*s, 22*s, 18*s, 26*s], fill=(255, 255, 255, 220)) # glint
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "proj_valerian.png"))
    
    # 4. Valerian Storm Evolution (54x54)
    w, h = 54, 54
    img, d, s = create_frame(w, h)
    for r in range(24, 6, -4):
        d.arc([(27 - r)*s, (27 - r)*s, (27 + r)*s, (27 + r)*s], start=0, end=300, fill=(155, 89, 182), width=3*s)
    d.ellipse([22*s, 22*s, 32*s, 32*s], fill=(241, 196, 15))
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "evo_valerian_storm.png"))
    
    # 5. Static Fur Icon (40x40)
    w, h = 40, 40
    img, d, s = create_frame(w, h)
    d.ellipse([6*s, 6*s, 34*s, 34*s], fill=(30, 80, 140), outline=(0, 210, 255), width=2*s)
    # Lightning bolt
    d.polygon([(20*s, 8*s), (12*s, 22*s), (20*s, 22*s), (16*s, 32*s), (28*s, 16*s), (21*s, 16*s), (24*s, 8*s)], fill=(255, 255, 80))
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "skill_static.png"))
    
    # 6. Meow Mine (38x38)
    w, h = 38, 38
    img, d, s = create_frame(w, h)
    d.ellipse([6*s, 6*s, 32*s, 32*s], fill=(230, 40, 50), outline=(150, 20, 25), width=2*s)
    # Cat Ears on mine
    d.polygon([(8*s, 10*s), (4*s, 2*s), (14*s, 8*s)], fill=(200, 30, 40))
    d.polygon([(30*s, 10*s), (34*s, 2*s), (24*s, 8*s)], fill=(200, 30, 40))
    # Ticking LED center
    d.ellipse([15*s, 15*s, 23*s, 23*s], fill=(255, 240, 100))
    img.resize((w, h), Image.Resampling.LANCZOS).save(os.path.join(ASSETS_DIR, "proj_mine.png"))
    print("New Skill & Evolution Assets Created!")

if __name__ == "__main__":
    print("Generating Complete Animated Spritesheets...")
    # Cats
    generate_cat_sheets("barsik", (230, 120, 30), (180, 80, 15), (255, 225, 170), (46, 204, 113))
    generate_cat_sheets("murzik", (70, 75, 85), (40, 45, 55), (220, 225, 235), (241, 196, 15))
    generate_cat_sheets("pukhlyash", (235, 225, 210), (195, 185, 170), (255, 255, 255), (52, 152, 219))
    
    # Enemies
    generate_mouse_sheet()
    generate_dog_sheet()
    generate_cucumber_sheet()
    generate_pigeon_sheet()
    generate_spitter_sheet()
    generate_boss_vacuum_sheet()
    generate_boss_dozer_sheet()
    
    # Skills
    generate_new_skill_sprites()
    print("All Animation Sheets Generated Successfully!")
