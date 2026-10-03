import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def render_cutscene():
    width = 640
    height = 368
    fps = 30
    total_duration = 7.5 # seconds
    total_frames = int(fps * total_duration)

    print(f"Rendering {total_frames} frames ({width}x{height} @ {fps}fps)...")

    # Load existing sprites
    chopper_sheet = Image.open(os.path.join(ASSETS_DIR, "cat_chopper_fly.png")).convert("RGBA")
    downwash_sheet = Image.open(os.path.join(ASSETS_DIR, "fx_chopper_downwash.png")).convert("RGBA")
    cat_run_sheet = Image.open(os.path.join(ASSETS_DIR, "cat_barsik_run.png")).convert("RGBA")
    cat_idle_sheet = Image.open(os.path.join(ASSETS_DIR, "cat_barsik_idle.png")).convert("RGBA")
    helipad_img = Image.open(os.path.join(ASSETS_DIR, "helipad_zone.png")).convert("RGBA")
    shadow_img = Image.open(os.path.join(ASSETS_DIR, "shadow_char.png")).convert("RGBA")
    plaza_img = Image.open(os.path.join(ASSETS_DIR, "map_plaza.png")).convert("RGBA")

    # Fonts
    font_title = ImageFont.truetype("arialbd.ttf", 16)
    font_sub = ImageFont.truetype("arialbd.ttf", 18)
    font_banner = ImageFont.truetype("arialbd.ttf", 26)

    # Spritesheet dimensions
    chopper_fw, chopper_fh = 128, 104
    downwash_fw, downwash_fh = 96, 96
    cat_fw, cat_fh = 64, 64

    # Pre-crop frames
    chopper_frames = [chopper_sheet.crop((i * chopper_fw, 0, (i + 1) * chopper_fw, chopper_fh)) for i in range(8)]
    downwash_frames = [downwash_sheet.crop((i * downwash_fw, 0, (i + 1) * downwash_fw, downwash_fh)) for i in range(8)]
    cat_run_frames = [cat_run_sheet.crop((i * cat_fw, 0, (i + 1) * cat_fw, cat_fh)) for i in range(4)]
    cat_idle_frames = [cat_idle_sheet.crop((i * cat_fw, 0, (i + 1) * cat_fw, cat_fh)) for i in range(2)]

    center_x = width // 2
    ground_y = 236

    frames_rgb = []

    for f_idx in range(total_frames):
        t = f_idx / float(fps)

        # Base Frame Canvas
        frame = Image.new("RGBA", (width, height), (30, 36, 46, 255))
        draw = ImageDraw.Draw(frame)

        # 1. Background Grass & Stone Arena
        for gy in range(0, height, 40):
            row_shade = int(28 + (gy / float(height)) * 22)
            draw.rectangle([0, gy, width, gy + 40], fill=(24, row_shade, 34))
            draw.line([(0, gy), (width, gy)], fill=(18, row_shade - 8, 25), width=1)

        # 2. Sanctuary Plaza
        plaza_scaled = plaza_img.resize((270, 270), Image.Resampling.LANCZOS)
        frame.paste(plaza_scaled, (center_x - 135, ground_y - 135), plaza_scaled)

        # 3. Glowing Helipad Zone
        pad_pulse = 1.0 + math.sin(t * 6.0) * 0.06
        pad_sz = int(120 * pad_pulse)
        pad_scaled = helipad_img.resize((pad_sz, pad_sz), Image.Resampling.LANCZOS)
        frame.paste(pad_scaled, (center_x - pad_sz // 2, ground_y - pad_sz // 2), pad_scaled)

        # Physics & Animation curves
        # Phase 1 (0.0s - 2.2s): Helicopter descends smoothly
        # Phase 2 (2.2s - 4.0s): Hover on pad, cat runs in, jumps onto ladder, climbs inside
        # Phase 3 (4.0s - 6.2s): Helicopter takes off, accelerates smoothly up to top-right
        # Phase 4 (6.2s - 7.5s): Celebratory ending card

        if t < 2.2:
            desc_t = t / 2.2
            desc_ease = 1.0 - (1.0 - desc_t) ** 2
            chop_x = center_x
            chop_y = -120 + desc_ease * ((ground_y - 65) - (-120))
            chop_scale = 1.0 + desc_ease * 0.45
            chop_tilt = math.sin(t * 8.0) * 1.5
            shadow_prog = desc_ease
            downwash_alpha = int(240 * desc_ease)
        elif t < 4.0:
            hover_t = t - 2.2
            chop_x = center_x
            chop_y = (ground_y - 65) + math.sin(hover_t * 6.0) * 4.0
            chop_scale = 1.45
            chop_tilt = math.sin(hover_t * 6.0) * 2.0
            shadow_prog = 1.0
            downwash_alpha = 240
        else:
            asc_t = (t - 4.0) / 2.5
            asc_ease = min(1.4, asc_t ** 2)
            chop_x = center_x + asc_ease * 380
            chop_y = (ground_y - 65) - asc_ease * 460
            chop_scale = 1.45 + min(0.3, asc_ease * 0.3)
            chop_tilt = -7.5 - min(5.0, asc_t * 4.0)
            shadow_prog = max(0.0, 1.0 - asc_t * 1.6)
            downwash_alpha = int(max(0, 240 * (1.0 - asc_t * 2.2)))

        # 4. Ground Shadow
        if shadow_prog > 0.05:
            sh_w = int(140 * shadow_prog)
            sh_h = int(36 * shadow_prog)
            sh_alpha = int(170 * shadow_prog)
            sh_scaled = shadow_img.resize((sh_w, sh_h), Image.Resampling.LANCZOS)
            # Tint alpha
            r, g, b, a = sh_scaled.split()
            a = a.point(lambda p: int(p * shadow_prog * 0.85))
            sh_tinted = Image.merge("RGBA", (r, g, b, a))
            frame.paste(sh_tinted, (center_x - sh_w // 2, ground_y + 12 - sh_h // 2), sh_tinted)

        # 5. Downwash Wind Vortex Ring
        if downwash_alpha > 10:
            dw_idx = int(t * 14) % 8
            dw_frame = downwash_frames[dw_idx]
            dw_sz = int(140 * (0.8 + 0.4 * shadow_prog))
            dw_scaled = dw_frame.resize((dw_sz, int(dw_sz * 0.7)), Image.Resampling.LANCZOS)
            r, g, b, a = dw_scaled.split()
            a = a.point(lambda p: int(p * (downwash_alpha / 255.0)))
            dw_tinted = Image.merge("RGBA", (r, g, b, a))
            frame.paste(dw_tinted, (center_x - dw_sz // 2, ground_y - int(dw_sz * 0.35)), dw_tinted)

        # 6. Cat Hero Logic
        cat_visible = True
        cat_x = 0
        cat_y = 0
        cat_frame_curr = None

        if t < 2.0:
            # Cat runs in from left toward helipad: x: 50 -> center_x - 30
            run_prog = t / 2.0
            cat_x = 50 + run_prog * ((center_x - 30) - 50)
            cat_y = ground_y + 16
            cat_idx = int(t * 12) % 4
            cat_frame_curr = cat_run_frames[cat_idx]
        elif t < 2.8:
            # Cat stands at ladder, ready to leap
            cat_x = center_x - 30
            cat_y = ground_y + 16
            cat_frame_curr = cat_idle_frames[int(t * 4) % 2]
        elif t < 3.6:
            # Cat leaps onto ladder and climbs into cockpit
            climb_t = (t - 2.8) / 0.8
            jump_h = math.sin(climb_t * math.pi) * 25
            cat_x = (center_x - 30) + climb_t * 18
            cat_y = (ground_y + 16) - (climb_t * 65) - jump_h
            cat_idx = int(t * 12) % 4
            cat_frame_curr = cat_run_frames[cat_idx]
        else:
            cat_visible = False

        if cat_visible and cat_frame_curr:
            c_sh_w, c_sh_h = 42, 16
            c_sh = shadow_img.resize((c_sh_w, c_sh_h), Image.Resampling.LANCZOS)
            frame.paste(c_sh, (int(cat_x - c_sh_w // 2), int(ground_y + 24 - c_sh_h // 2)), c_sh)
            frame.paste(cat_frame_curr, (int(cat_x - cat_fw // 2), int(cat_y - cat_fh // 2)), cat_frame_curr)

        # 7. Rescue Helicopter
        chop_anim_idx = int(t * 16) % 8
        c_frame = chopper_frames[chop_anim_idx]
        w_scaled = int(chopper_fw * chop_scale)
        h_scaled = int(chopper_fh * chop_scale)
        c_resized = c_frame.resize((w_scaled, h_scaled), Image.Resampling.LANCZOS)
        if abs(chop_tilt) > 0.1:
            c_rotated = c_resized.rotate(chop_tilt, resample=Image.Resampling.BICUBIC, expand=True)
        else:
            c_rotated = c_resized

        rw, rh = c_rotated.size
        frame.paste(c_rotated, (int(chop_x - rw // 2), int(chop_y - rh // 2)), c_rotated)

        # 8. Pilot & Rescued Cat waving from inside helicopter (Phase 3)
        if t >= 3.6 and t < 6.2:
            rad_tilt = math.radians(-chop_tilt)
            cockpit_dx = -22 * chop_scale
            cockpit_dy = 2 * chop_scale + math.sin(t * 14) * 2.5
            cx_world = chop_x + (cockpit_dx * math.cos(rad_tilt) - cockpit_dy * math.sin(rad_tilt))
            cy_world = chop_y + (cockpit_dx * math.sin(rad_tilt) + cockpit_dy * math.cos(rad_tilt))

            pw = int(14 * chop_scale)
            ph = int(14 * chop_scale)
            paw_x = int(cx_world - pw // 2)
            paw_y = int(cy_world - ph // 2)
            # Waving paw!
            draw.ellipse([paw_x, paw_y, paw_x + pw, paw_y + ph], fill=(255, 140, 50))
            draw.ellipse([paw_x + 2, paw_y + 2, paw_x + pw - 2, paw_y + ph - 2], fill=(255, 210, 170))

        # 9. Translucent Searchlight Cone via Overlay
        if t < 4.2:
            cone_overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            cone_draw = ImageDraw.Draw(cone_overlay)
            cone_alpha = int(40 + math.sin(t * 8) * 20)
            lx = int(chop_x - 32 * chop_scale)
            ly = int(chop_y + 12 * chop_scale)
            cone_pts = [
                (lx, ly),
                (lx - int(110 * chop_scale), int(ground_y + 60)),
                (lx + int(20 * chop_scale), int(ground_y + 60))
            ]
            cone_draw.polygon(cone_pts, fill=(255, 250, 130, cone_alpha))
            frame = Image.alpha_composite(frame, cone_overlay)
            draw = ImageDraw.Draw(frame)

        # 10. Flash effect at takeoff (around t = 4.0s)
        if 3.9 <= t <= 4.4:
            flash_p = 1.0 - abs(t - 4.15) / 0.25
            flash_alpha = int(160 * flash_p)
            flash_overlay = Image.new("RGBA", (width, height), (255, 245, 190, flash_alpha))
            frame = Image.alpha_composite(frame, flash_overlay)
            draw = ImageDraw.Draw(frame)

        # 11. Cinematic Letterbox & Typography
        # Top and bottom bars
        draw.rectangle([0, 0, width, 36], fill=(12, 15, 20, 245))
        draw.rectangle([0, height - 42, width, height], fill=(12, 15, 20, 245))

        # Header Title
        draw.text((center_x, 18), "КОТОПОКАЛИПСИС: СПАСАТЕЛЬНАЯ ОПЕРАЦИЯ", fill=(200, 220, 240), font=font_title, anchor="mm")

        # Subtitles
        if t < 2.2:
            subtitle = "БОРТ «9 ЖИЗНЕЙ» НА ПОСАДКЕ В ЦЕНТРЕ СВЯТИЛИЩА..."
            sub_color = (46, 204, 113)
        elif t < 3.6:
            subtitle = "КОТИК ЗАПРЫГИВАЕТ НА ЛЕСТНИЦУ ВЕРТОЛЁТА!"
            sub_color = (241, 196, 15)
        elif t < 5.8:
            subtitle = "ВЗЛЁТ! ЭВАКУАЦИЯ ПРОШЛА УСПЕШНО!"
            sub_color = (255, 215, 0)
        else:
            subtitle = "МИССИЯ ВЫПОЛНЕНА! КОТ В БЕЗОПАСНОСТИ! 🚁✨"
            sub_color = (255, 255, 255)

        draw.text((center_x, height - 21), subtitle, fill=sub_color, font=font_sub, anchor="mm")

        # Ending Grand Banner Overlay (at t >= 6.0s)
        if t >= 6.0:
            card_p = min(1.0, (t - 6.0) / 0.6)
            card_overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
            card_draw = ImageDraw.Draw(card_overlay)
            # Gold badge box
            bw, bh = 460, 70
            bx = center_x - bw // 2
            by = center_x // 2 + 10
            card_draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=12,
                                        fill=(20, 30, 42, int(230 * card_p)),
                                        outline=(241, 196, 15, int(255 * card_p)), width=3)
            card_draw.text((center_x, by + bh // 2), "🏆 СПАСЕНИЕ УСПЕШНО! 🏆", fill=(255, 215, 0, int(255 * card_p)), font=font_banner, anchor="mm")
            frame = Image.alpha_composite(frame, card_overlay)
            draw = ImageDraw.Draw(frame)

        # Convert to RGB for encoding
        rgb_frame = Image.new("RGB", (width, height), (0, 0, 0))
        rgb_frame.paste(frame, mask=frame.split()[3])
        frames_rgb.append(np.array(rgb_frame))

    # 1. Save High Definition MP4
    mp4_path = os.path.join(ASSETS_DIR, "cat_evacuation_ending.mp4")
    print(f"Writing MP4: {mp4_path}...")
    imageio.mimwrite(mp4_path, frames_rgb, fps=fps, quality=9, codec="libx264", pixelformat="yuv420p")
    print(f"MP4 Saved: {mp4_path} ({os.path.getsize(mp4_path) / 1024:.1f} KB)")

    # 2. Save Animated GIF (15 fps, optimized)
    gif_path = os.path.join(ASSETS_DIR, "cat_evacuation_ending.gif")
    print(f"Writing GIF: {gif_path}...")
    gif_frames = frames_rgb[::2]
    imageio.mimwrite(gif_path, gif_frames, fps=15, loop=0)
    print(f"GIF Saved: {gif_path} ({os.path.getsize(gif_path) / 1024:.1f} KB)")

if __name__ == "__main__":
    render_cutscene()
