import os, sys
from playwright.sync_api import sync_playwright
H=os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    pg.goto("file://"+os.path.join(H,"guide.html")); pg.wait_for_load_state("networkidle"); pg.evaluate("document.fonts.ready")
    # report overflowing pages
    print(pg.evaluate("""[...document.querySelectorAll('.page')].map((p,i)=>{const r=p.getBoundingClientRect();let m=0;p.querySelectorAll('*').forEach(e=>{if(e.closest('.mascot,.bg,.shade,.bot,.pno'))return;const b=e.getBoundingClientRect();m=Math.max(m,b.bottom-r.top)});return (i+1)+':'+Math.round(m)+'/'+Math.round(r.height)})"""))
    pg.pdf(path=os.path.join(H,"n8n-guide.pdf"),prefer_css_page_size=True,print_background=True)
    b.close()
