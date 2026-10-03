import os
import math
from PIL import Image, ImageDraw

ASSETS_DIR = "assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_chopper_spritesheet():
    fw, fh = 128, 104
    num_frames = 8
    scale = 4
    sheet_w = fw * num_frames
    sheet_h = fh

    big_sheet = Image.new("RGBA", (sheet_w * scale, sheet_h * scale), (0, 0, 0, 0))

    for frame in range(num_frames):
        t = frame / float(num_frames) # 0.0 to 1.0
        angle_rad = t * 2 * math.pi

        frame_img = Image.new("RGBA", (fw * scale, fh * scale), (0, 0, 0, 0))
        d = ImageDraw.Draw(frame_img)
        s = scale

        # Frame center & vertical hover bobbing (2.5px bob)
        bob_y = math.sin(angle_rad) * 2.5 * s
        ladder_sway = math.sin(angle_rad - math.pi * 0.4) * 3.2 * s

        # Chopper base anchor in frame:
        cx = 58 * s
        cy = (46 * s) + bob_y

        # 1. ROPE LADDER (Hanging down from skids, swaying in wind)
        lad_x = cx - 12 * s
        lad_top = cy + 18 * s
        lad_bottom = cy + 48 * s
        # Two rope verticals
        d.line([(lad_x - 7*s, lad_top), (lad_x - 7*s + ladder_sway, lad_bottom)], fill=(120, 80, 40), width=2*s)
        d.line([(lad_x + 7*s, lad_top), (lad_x + 7*s + ladder_sway, lad_bottom)], fill=(120, 80, 40), width=2*s)
        # Rungs
        for r in range(5):
            rt = r / 4.0
            rx1 = (lad_x - 7*s) * (1 - rt) + (lad_x - 7*s + ladder_sway) * rt
            rx2 = (lad_x + 7*s) * (1 - rt) + (lad_x + 7*s + ladder_sway) * rt
            ry = lad_top + rt * (lad_bottom - lad_top)
            d.line([(rx1, ry), (rx2, ry)], fill=(195, 145, 80), width=2*s)

        # 2. LANDING SKIDS (Chrome metal with curved nose)
        skid_y = cy + 22 * s
        # Cross struts
        d.line([(cx - 20*s, cy + 12*s), (cx - 26*s, skid_y)], fill=(100, 115, 130), width=3*s)
        d.line([(cx + 10*s, cy + 12*s), (cx + 4*s, skid_y)], fill=(100, 115, 130), width=3*s)
        # Main rail
        d.line([(cx - 34*s, skid_y), (cx + 26*s, skid_y)], fill=(175, 190, 205), width=3*s)
        # Curved front tip
        d.arc([cx - 42*s, skid_y - 12*s, cx - 30*s, skid_y + 2*s], start=90, end=210, fill=(175, 190, 205), width=3*s)

        # 3. TAIL BOOM & TAIL FIN
        boom_pts = [
            (cx + 8*s, cy - 2*s),
            (cx + 50*s, cy - 10*s),
            (cx + 52*s, cy - 4*s),
            (cx + 8*s, cy + 6*s)
        ]
        d.polygon(boom_pts, fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
        # Gold accent stripe on tail boom
        d.line([(cx + 12*s, cy + 1*s), (cx + 48*s, cy - 7*s)], fill=(241, 196, 15), width=2*s)

        # Tail Fin (vertical stabilizer)
        fin_pts = [
            (cx + 46*s, cy - 7*s),
            (cx + 56*s, cy - 24*s),
            (cx + 60*s, cy - 22*s),
            (cx + 51*s, cy - 2*s)
        ]
        d.polygon(fin_pts, fill=(241, 196, 15), outline=(180, 130, 10), width=2*s)

        # Animated Tail Rotor (Spins 3x fast)
        tail_rotor_cx = cx + 55 * s
        tail_rotor_cy = cy - 16 * s
        tr_angle = angle_rad * 3
        tr_len = 10 * s
        tr_x1 = tail_rotor_cx + math.cos(tr_angle) * tr_len
        tr_y1 = tail_rotor_cy + math.sin(tr_angle) * tr_len
        tr_x2 = tail_rotor_cx - math.cos(tr_angle) * tr_len
        tr_y2 = tail_rotor_cy - math.sin(tr_angle) * tr_len
        # Tail rotor blur circle
        d.ellipse([tail_rotor_cx - tr_len, tail_rotor_cy - tr_len, tail_rotor_cx + tr_len, tail_rotor_cy + tr_len],
                  fill=(220, 240, 255, 35), outline=(200, 225, 245, 70), width=1*s)
        d.line([(tr_x1, tr_y1), (tr_x2, tr_y2)], fill=(230, 240, 250, 220), width=2*s)
        d.ellipse([tail_rotor_cx - 2*s, tail_rotor_cy - 2*s, tail_rotor_cx + 2*s, tail_rotor_cy + 2*s], fill=(40, 45, 55))

        # Blinking Strobe on Tail Fin Tip
        tail_strobe_on = (frame in (0, 1, 4, 5))
        if tail_strobe_on:
            d.ellipse([cx + 56*s - 4*s, cy - 24*s - 4*s, cx + 56*s + 4*s, cy - 24*s + 4*s], fill=(255, 60, 60, 150))
            d.ellipse([cx + 56*s - 2*s, cy - 24*s - 2*s, cx + 56*s + 2*s, cy - 24*s + 2*s], fill=(255, 230, 230))
        else:
            d.ellipse([cx + 56*s - 2*s, cy - 24*s - 2*s, cx + 56*s + 2*s, cy - 24*s + 2*s], fill=(120, 20, 20))

        # 4. TURBINE EXHAUST PUFFS
        exh_x = cx + 6 * s
        exh_y = cy - 6 * s
        d.ellipse([exh_x - 3*s, exh_y - 2*s, exh_x + 5*s, exh_y + 3*s], fill=(50, 60, 70), outline=(30, 35, 40), width=1*s)
        puff_dist = ((frame % 4) + 1) * 3 * s
        puff_alpha = int(90 * (1.0 - (frame % 4) / 4.0))
        d.ellipse([exh_x + puff_dist - 3*s, exh_y - 2*s, exh_x + puff_dist + 4*s, exh_y + 3*s], fill=(180, 200, 215, puff_alpha))

        # 5. MAIN FUSELAGE (Teal & Gold Rescue Body)
        d.ellipse([cx - 38*s, cy - 14*s, cx + 20*s, cy + 18*s], fill=(36, 112, 125), outline=(18, 60, 70), width=2*s)
        d.chord([cx - 38*s, cy - 14*s, cx + 20*s, cy + 18*s], start=0, end=180, fill=(24, 78, 88))
        d.line([(cx - 34*s, cy + 4*s), (cx + 18*s, cy + 3*s)], fill=(241, 196, 15), width=3*s)
        d.line([(cx - 32*s, cy + 7*s), (cx + 16*s, cy + 6*s)], fill=(200, 150, 10), width=1*s)

        # 6. CAT EARS (Rescue Pilot Ear Cowlings on Roof!)
        d.polygon([(cx - 18*s, cy - 10*s), (cx - 13*s, cy - 24*s), (cx - 7*s, cy - 12*s)], fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
        d.polygon([(cx - 16*s, cy - 11*s), (cx - 13*s, cy - 21*s), (cx - 9*s, cy - 12*s)], fill=(255, 140, 160))
        d.polygon([(cx, cy - 12*s), (cx + 5*s, cy - 24*s), (cx + 11*s, cy - 10*s)], fill=(28, 85, 95), outline=(16, 50, 60), width=2*s)
        d.polygon([(cx + 2*s, cy - 12*s), (cx + 5*s, cy - 21*s), (cx + 9*s, cy - 11*s)], fill=(255, 140, 160))

        # 7. COCKPIT BUBBLE & RESCUE PILOT CAT
        bubble_bbox = [cx - 36*s, cy - 10*s, cx - 10*s, cy + 12*s]
        d.ellipse(bubble_bbox, fill=(110, 205, 230, 240), outline=(18, 60, 70), width=2*s)

        # Pilot Cat Inside
        pilot_cx = cx - 23 * s
        pilot_cy = cy + 2 * s + math.sin(angle_rad * 2) * 0.8 * s
        # Head
        d.ellipse([pilot_cx - 6*s, pilot_cy - 5*s, pilot_cx + 6*s, pilot_cy + 5*s], fill=(230, 126, 34))
        # Ears
        d.polygon([(pilot_cx - 5*s, pilot_cy - 4*s), (pilot_cx - 4*s, pilot_cy - 9*s), (pilot_cx - 1*s, pilot_cy - 5*s)], fill=(211, 84, 0))
        d.polygon([(pilot_cx + 1*s, pilot_cy - 5*s), (pilot_cx + 4*s, pilot_cy - 9*s), (pilot_cx + 5*s, pilot_cy - 4*s)], fill=(211, 84, 0))
        # Aviator Headset
        d.arc([pilot_cx - 7*s, pilot_cy - 8*s, pilot_cx + 7*s, pilot_cy + 2*s], start=180, end=360, fill=(40, 40, 40), width=2*s)
        d.ellipse([pilot_cx - 8*s, pilot_cy - 3*s, pilot_cx - 5*s, pilot_cy + 3*s], fill=(50, 50, 50))
        d.ellipse([pilot_cx + 5*s, pilot_cy - 3*s, pilot_cx + 8*s, pilot_cy + 3*s], fill=(50, 50, 50))
        # Sunglasses
        d.rectangle([pilot_cx - 5*s, pilot_cy - 2*s, pilot_cx - 1*s, pilot_cy + 2*s], fill=(20, 25, 30))
        d.rectangle([pilot_cx + 1*s, pilot_cy - 2*s, pilot_cx + 5*s, pilot_cy + 2*s], fill=(20, 25, 30))
        d.line([(pilot_cx - 1*s, pilot_cy), (pilot_cx + 1*s, pilot_cy)], fill=(20, 25, 30), width=1*s)
        # Snout
        d.ellipse([pilot_cx - 3*s, pilot_cy + 1*s, pilot_cx + 3*s, pilot_cy + 4*s], fill=(255, 240, 230))
        d.ellipse([pilot_cx - 1*s, pilot_cy + 1*s, pilot_cx + 1*s, pilot_cy + 2*s], fill=(231, 76, 60))

        # Cockpit glass reflections / glint
        glint_shift = math.sin(angle_rad) * 2 * s
        d.ellipse([cx - 32*s + glint_shift, cy - 8*s, cx - 22*s + glint_shift, cy + 2*s], fill=(240, 252, 255, 120))
        d.arc([cx - 34*s, cy - 8*s, cx - 12*s, cy + 10*s], start=160, end=260, fill=(255, 255, 255, 180), width=2*s)

        # 8. SEARCHLIGHT
        light_x = cx - 32 * s
        light_y = cy + 12 * s
        d.ellipse([light_x - 3*s, light_y - 3*s, light_x + 3*s, light_y + 3*s], fill=(255, 255, 220), outline=(80, 85, 90), width=1*s)
        cone_alpha = int(70 + math.sin(angle_rad * 2) * 25)
        cone_pts = [
            (light_x, light_y),
            (light_x - 38*s, light_y + 36*s),
            (light_x - 14*s, light_y + 36*s)
        ]
        d.polygon(cone_pts, fill=(255, 245, 120, cone_alpha))
        d.ellipse([light_x - 40*s, light_y + 32*s, light_x - 12*s, light_y + 40*s], fill=(255, 245, 120, cone_alpha // 2))

        # 9. ROTOR MAST & SPINNING MAIN ROTOR BLADES
        mast_x = cx - 4 * s
        mast_y = cy - 14 * s
        d.rectangle([mast_x - 2*s, mast_y - 6*s, mast_x + 2*s, mast_y], fill=(130, 140, 150), outline=(60, 70, 80), width=1*s)
        rotor_hub_y = mast_y - 6 * s
        d.ellipse([mast_x - 5*s, rotor_hub_y - 3*s, mast_x + 5*s, rotor_hub_y + 3*s], fill=(50, 55, 65))

        # Perspective disc
        disc_rx = 46 * s
        disc_ry = 9 * s
        d.ellipse([mast_x - disc_rx, rotor_hub_y - disc_ry, mast_x + disc_rx, rotor_hub_y + disc_ry],
                  fill=(220, 240, 255, 45), outline=(180, 220, 250, 90), width=2*s)

        # 2 Main Rotor Blades rotating
        blade_phase = angle_rad * 2
        for b_dir in [1, -1]:
            b_ang = blade_phase + (0 if b_dir == 1 else math.pi)
            bx = mast_x + math.cos(b_ang) * disc_rx
            by = rotor_hub_y + math.sin(b_ang) * disc_ry

            d.line([(mast_x, rotor_hub_y), (bx, by)], fill=(45, 52, 62, 240), width=4*s)
            d.line([(mast_x, rotor_hub_y), (bx, by)], fill=(120, 135, 150, 200), width=2*s)
            # Yellow hazard tip
            tip_x = mast_x + (bx - mast_x) * 0.80
            tip_y = rotor_hub_y + (by - rotor_hub_y) * 0.80
            d.line([(tip_x, tip_y), (bx, by)], fill=(241, 196, 15, 240), width=4*s)

        # Hub cap
        d.circle([mast_x, rotor_hub_y], radius=3*s, fill=(20, 25, 30), outline=(200, 210, 225), width=1*s)

        # Blinking beacon on rotor hub
        if frame in (2, 3, 6, 7):
            d.circle([mast_x, rotor_hub_y], radius=2*s, fill=(255, 80, 80))

        big_sheet.paste(frame_img, (frame * fw * scale, 0), frame_img)

    final_sheet = big_sheet.resize((sheet_w, sheet_h), Image.Resampling.LANCZOS)
    out_path = os.path.join(ASSETS_DIR, "cat_chopper_fly.png")
    final_sheet.save(out_path, "PNG")
    print(f"Generated Chopper Spritesheet: {out_path} ({sheet_w}x{sheet_h}, {num_frames} frames of {fw}x{fh})")

    # Also save frame 0 as standalone cat_chopper.png for fallback / UI
    frame0 = final_sheet.crop((0, 0, fw, fh))
    fallback_path = os.path.join(ASSETS_DIR, "cat_chopper.png")
    frame0.save(fallback_path, "PNG")
    print(f"Updated Fallback: {fallback_path} ({fw}x{fh})")


def generate_downwash_spritesheet():
    fw, fh = 96, 96
    num_frames = 8
    scale = 4
    sheet_w = fw * num_frames
    sheet_h = fh

    big_sheet = Image.new("RGBA", (sheet_w * scale, sheet_h * scale), (0, 0, 0, 0))

    for frame in range(num_frames):
        t = frame / float(num_frames)
        frame_img = Image.new("RGBA", (fw * scale, fh * scale), (0, 0, 0, 0))
        d = ImageDraw.Draw(frame_img)
        s = scale
        cx, cy = (fw // 2) * s, (fh // 2) * s

        # Expanding concentric wind rings
        for ring_idx in range(3):
            ring_t = (t + ring_idx / 3.0) % 1.0
            radius = (16 + ring_t * 28) * s
            alpha = int(140 * (1.0 - ring_t))
            width = max(1, int((3 - ring_t * 2) * s))
            d.ellipse([cx - radius, cy - radius * 0.7, cx + radius, cy + radius * 0.7],
                      outline=(220, 240, 255, alpha), width=width)

        # Swirling dust/wind spirals
        num_spirals = 8
        for i in range(num_spirals):
            base_angle = (i / float(num_spirals)) * 2 * math.pi + (t * 2 * math.pi)
            r_start = 14 * s
            r_end = 42 * s
            x1 = cx + math.cos(base_angle) * r_start
            y1 = cy + math.sin(base_angle) * (r_start * 0.7)
            x2 = cx + math.cos(base_angle + 0.8) * r_end
            y2 = cy + math.sin(base_angle + 0.8) * (r_end * 0.7)
            swirl_alpha = int(90 * math.sin((t * math.pi + i) % math.pi))
            d.line([(x1, y1), (x2, y2)], fill=(200, 225, 250, swirl_alpha), width=2*s)

        big_sheet.paste(frame_img, (frame * fw * scale, 0), frame_img)

    final_sheet = big_sheet.resize((sheet_w, sheet_h), Image.Resampling.LANCZOS)
    out_path = os.path.join(ASSETS_DIR, "fx_chopper_downwash.png")
    final_sheet.save(out_path, "PNG")
    print(f"Generated Downwash Spritesheet: {out_path} ({sheet_w}x{sheet_h}, {num_frames} frames of {fw}x{fh})")

if __name__ == "__main__":
    generate_chopper_spritesheet()
    generate_downwash_spritesheet()
