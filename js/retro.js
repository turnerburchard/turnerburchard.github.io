(function () {
    var STORAGE_KEY = 'retroMode';
    var HITS_KEY = 'retroHits';

    function isRetro() { return document.documentElement.classList.contains('retro'); }

    function setRetro(on) {
        document.documentElement.classList.toggle('retro', !!on);
        try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (e) {}
        if (on) {
            renderDecorations();
            startSparkles();
            bumpHitCounter();
        } else {
            clearDecorations();
            stopSparkles();
        }
    }

    /* ─────────── Hit counter (LED-style fallback for in-page <span class="retro-counter">) ─── */
    function bumpHitCounter() {
        var n = 0;
        try { n = parseInt(localStorage.getItem(HITS_KEY) || '41', 10); } catch (e) { n = 41; }
        n = isNaN(n) ? 42 : n + 1;
        try { localStorage.setItem(HITS_KEY, String(n)); } catch (e) {}
        var pad = String(n).padStart(6, '0');
        document.querySelectorAll('.retro-counter').forEach(function (el) { el.textContent = pad; });
    }

    /* ─────────── Floating decoration pool (real GIFs from gifcities.org) ─────────── */
    /* Internet Archive hot-links — see files/retro/README.md to localize.
       To remove a bad/broken GIF, delete its line. Comet URLs were removed
       because the most-common gifcities comet renders as a grey square. */
    var DECO_URLS = [
        '/files/retro/gifs/2H5Y5ECXG45X3P53SYVGUYSASJZBHLEB.gif',
        '/files/retro/gifs/2HS3LGJP7MMSRVS4ZILYU2YMQDA4HG3G.gif',
        '/files/retro/gifs/2JJFODFY355W3OIKLMNH4H5LU4FYOFIT.gif',
        '/files/retro/gifs/2L2QINYPJ7WU6JDPV2NGDKDJP6HJUJBF.gif',
        '/files/retro/gifs/2MUH37U7GFW3ORNEWQWT7N4BSJHYSHUF.gif',
        '/files/retro/gifs/2O6IS442A6JPO6XZE6MXQS4FGTP2SJXT.gif',
        '/files/retro/gifs/2TUH7HHD6REMG6TT3E2W4UKMIVEOKUEG.gif',
        '/files/retro/gifs/2V7MJGYLVQZQYALRR256PSXKQSQBGJDN.gif',
        '/files/retro/gifs/2VXQBHKO7DGWURGFU5K4PG54ZNPGB2EJ.gif',
        '/files/retro/gifs/2YKDM4BV4BV6HJCJNEKCHKA4HACSKOIE.gif',
        '/files/retro/gifs/34WP6M4L332I6BOTEOLKC7H6T7SIUHAB.gif',
        '/files/retro/gifs/34YW3UC4LIH3HNLZDL64ZF3WKZMA2WXI.gif',
        '/files/retro/gifs/35FNQVJ7YEZ27OCPMYCTML4KEFNQRKOQ.gif',
        '/files/retro/gifs/3C3YRRQ6C7EGPWXNVMER4OMEJWJRDTSN.gif',
        '/files/retro/gifs/3D2CBC46WDWJX4XXETETUJGTJZIMSQMS.gif',
        '/files/retro/gifs/3ECO73Y5OEICV66MOXUWWP5VO7IRBHN6.gif',
        '/files/retro/gifs/3IKSC2OZ2AZ4NPKM3MAZLERGS4NUKZXB.gif',
        '/files/retro/gifs/3SCEE4TUKAF67IM3CY6ZBJ4PHBNB52IY.gif',
        '/files/retro/gifs/3YZ6ELFCFKNPIP7MK7MQWDS4O2GYPUYO.gif',
        '/files/retro/gifs/42KUIGIM4NC3JDWA4WQDS5VYXD4VVWMC.gif',
        '/files/retro/gifs/4BERIGFTGAJWB66FFLU4B5TN7K5HG3DM.gif',
        '/files/retro/gifs/4BWEZHKO22EVZLK6DR3DVVIJ5YUZVWHG.gif',
        '/files/retro/gifs/4CILEZHFEPTVGCZH7GLVEGYD5HNSLBSD.gif',
        '/files/retro/gifs/4G44GV34PDZETRMXHGCZT6Y5LJNIQASR.gif',
        '/files/retro/gifs/4IIOIHUCIK3N34K3BUTYCYZDZISFHJJC.gif',
        '/files/retro/gifs/4K5L7E5TLGZE3IH32MJ564W5M2GOYJU2.gif',
        '/files/retro/gifs/4PO5RUXGO23UULVCWB7T263DRGDAUR5Z.gif',
        '/files/retro/gifs/4QP5BCSHBN2EAP4GV3UOMPCAPEGYGTIG.gif',
        '/files/retro/gifs/4RDU5EJI7ICAEB7LNGPZNXGF5OMJX5JO.gif',
        '/files/retro/gifs/4SVP72BTHMGIE4MCIT4ILUQI44TRQHXZ.gif',
        '/files/retro/gifs/56ZCGLNJN4AQMX6NMJPH2AFWHY6HSXGR.gif',
        '/files/retro/gifs/5CV6SWP62EMJRZSZENPLXGXQTRG3EBOY.gif',
        '/files/retro/gifs/5G24JC53UCGHHBEB5HCJTZ3N3X2Y6FFD.gif',
        '/files/retro/gifs/5GCLUPCC7D23J5AFXL6WMKXIDFDV5NGX.gif',
        '/files/retro/gifs/5HYBH4VQK5D3YLMK3VZRDIDYPKDTF57M.gif',
        '/files/retro/gifs/5L5BLCPZBQX7BRU4ZBOSV5GG6AJCP7SC.gif',
        '/files/retro/gifs/5METQZHFDOEBBGPSY3JX3E4YGXWAAZHP.gif',
        '/files/retro/gifs/5PGSSBD3RLI4PYWZXX3GJTJZ7AIRUQ3E.gif',
        '/files/retro/gifs/5V6VHCFQ7FCPZPADFC6BELIMCG3HOCCU.gif',
        '/files/retro/gifs/64QVEMQGPAMUSYAFWY7ONSTRSNKUE335.gif',
        '/files/retro/gifs/677G633277FIVNOFKN5DFSIXBQM3TRGQ.gif',
        '/files/retro/gifs/6NXPAUKMXCIUL7OUMDTJ2VGDZL4JDEBE.gif',
        '/files/retro/gifs/7EK4ZCQVSDBGKYPSXF5QWK4N3IUI34VS.gif',
        '/files/retro/gifs/7JJKXZA32FU622TQIH2HPIDPCYUMEMQH.gif',
        '/files/retro/gifs/7SQJ3JQTSPKVPZF6XGSWWI26XMOPCIES.gif',
        '/files/retro/gifs/AAWKDH65NL3II7NYAM4QYMKKAGRG3BUP.gif',
        '/files/retro/gifs/AECFOVVJ5SHQT3M77QW63YVNVJZDBVDB.gif',
        '/files/retro/gifs/AGIIST4LCC7WB2DJRKZH5EYRUE62YAZQ.gif',
        '/files/retro/gifs/AIJVZW6ZKU2VUFCZQA4LAMXPMKZ5BCNN.gif',
        '/files/retro/gifs/ARI4TLCPYQ5WNBAFTAIUNSR6NTW24CSR.gif',
        '/files/retro/gifs/ARUIQ3ICRMM7OCDGXBK3WWWARD4XJ4L5.gif',
        '/files/retro/gifs/ASN337QQEWTFWNQPNE3AXT5VYBWWYHSW.gif',
        '/files/retro/gifs/BFUOKPPP25NNYMVZLNF3IN4VNBCYJJNC.gif',
        '/files/retro/gifs/BJHYLX5OPGRWMCVOOVAV2UIEJOFW256Z.gif',
        '/files/retro/gifs/BT2YMBPB6OJPUNS2STY4C6OVX6PQYPYU.gif',
        '/files/retro/gifs/BZHEVGSVHCE4MKU5L4Z4S3XH5UP2XWD5.gif',
        '/files/retro/gifs/CB3RSVM74NEWNMSG4U3ZBJQZ4V6I6R2U.gif',
        '/files/retro/gifs/CBDPJBLBPHPJW2XKAE23Y2J3HYRPFKIN.gif',
        '/files/retro/gifs/CG3P74OOONQYZFCKDFL7R3D2ZB433UPK.gif',
        '/files/retro/gifs/COMAX57WORBM543TX7Z37Y3KATZC2363.gif',
        '/files/retro/gifs/CZ4UR6Z355FUGWQVIRKPPB5CIB2M6JQL.gif',
        '/files/retro/gifs/DQG6EGNAFZFIH6JF3MLPRZIDLFYC2UG3.gif',
        '/files/retro/gifs/EGNASDKGPBBHLCTCJYLLD3ZIUHMJVLFN.gif',
        '/files/retro/gifs/F3XL3IZMO4BWERMQ32M3Z3BCLKRYU2WB.gif',
        '/files/retro/gifs/FHL43ZDPWQ2Z2NVPJUWMYHYLKJQISQSR.gif',
        '/files/retro/gifs/FITB4BYX7IE762GWDX2IL4PGWDSF6DFX.gif',
        '/files/retro/gifs/FSDMKPSO3X76K5NFSAE44GD4NTTLAKSK.gif',
        '/files/retro/gifs/G4FJ47QM4GHZ3CPSK2Y52PFXOOOGKAUU.gif',
        '/files/retro/gifs/GZQBW7K7EUAFDHX4NBI6LTBXOE7ZR3ZW.gif',
        '/files/retro/gifs/H2O6MF7333DHZCK2CKRS5LQGHZQEARVS.gif',
        '/files/retro/gifs/H4UVYRKQ5KE6KAXWRSV2UFLIWNT3MYMP.gif',
        '/files/retro/gifs/HQ42RARPPFNVO2B2GS6J4OBBTETEDW7K.gif',
        '/files/retro/gifs/HTQPSBRZ4GUVHNFUZ2IIXSKMGV3XFZQS.gif',
        '/files/retro/gifs/IV4CH4W3ZUATWYR43NO5FQWOLKRIX4YK.gif',
        '/files/retro/gifs/IXZ3WFMDFFO3LAIRKI55VBPDKCZTSQHO.gif',
        '/files/retro/gifs/JIEGNST7AJ4VJPMM5MROR7BNPCLZ5N72.gif',
        '/files/retro/gifs/K4OAQ45E3M4IZRCELLEBIV47STVJJDRV.gif',
        '/files/retro/gifs/KKXUDPAESKUFZURCVPMBKO4LA2RYOS77.gif',
        '/files/retro/gifs/L655H36WB4VRCWFDFT53EVWW4D26SJ6Q.gif',
        '/files/retro/gifs/LAMC5KFNP4GQRDJUY4LWZBUL54FICAVE.gif'
    ];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function shuffled(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function renderDecorations() {
        clearDecorations();
        var layer = document.createElement('div');
        layer.className = 'retro-deco-layer';
        layer.setAttribute('aria-hidden', 'true');
        // Deal from a shuffled pool so no GIF repeats until the pool is exhausted
        var pool = shuffled(DECO_URLS);
        var poolIdx = 0;
        var count = window.innerWidth < 700 ? 26 : Math.min(75, pool.length);
        // Poisson-disk-ish placement: reject any spot too close to an existing one
        var placed = [];
        var minDist = window.innerWidth < 700 ? 12 : 8;  // in viewport units
        var maxAttempts = 60;
        for (var i = 0; i < count; i++) {
            var top, left, ok = false;
            for (var a = 0; a < maxAttempts; a++) {
                top = rand(-1, 94);
                left = rand(-1, 91);  // leave room on right so decos don't sit over the scrollbar
                ok = true;
                for (var p = 0; p < placed.length; p++) {
                    var dx = placed[p].left - left;
                    var dy = placed[p].top - top;
                    if (dx * dx + dy * dy < minDist * minDist) { ok = false; break; }
                }
                if (ok) break;
            }
            if (!ok) continue;
            placed.push({ top: top, left: left });

            var url = pool[poolIdx++ % pool.length];
            var el = document.createElement('img');
            el.className = 'retro-deco';
            el.src = url;
            el.alt = '';
            el.loading = 'lazy';
            var size = rand(46, 95);
            var rot = rand(-18, 18);
            el.style.top = top + 'vh';
            el.style.left = left + 'vw';
            el.style.width = size + 'px';
            el.style.height = 'auto';
            el.style.transform = 'rotate(' + rot + 'deg)';
            if (Math.random() < 0.28) {
                el.classList.add('drift');
                el.style.setProperty('--rot', rot + 'deg');
                el.style.animationDelay = (-rand(0, 20)) + 's';
            }
            layer.appendChild(el);
        }
        document.body.insertBefore(layer, document.body.firstChild);
    }

    function clearDecorations() {
        document.querySelectorAll('.retro-deco-layer').forEach(function (n) { n.remove(); });
    }

    /* ─────────── Sparkle cursor trail ─────────── */
    var sparkleHandler = null;
    var lastSparkle = 0;
    function onMove(e) {
        var now = Date.now();
        if (now - lastSparkle < 40) return;
        lastSparkle = now;
        var s = document.createElement('div');
        s.className = 'retro-sparkle';
        s.style.left = (e.clientX - 5) + 'px';
        s.style.top = (e.clientY - 5) + 'px';
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 700);
    }
    function startSparkles() {
        if (sparkleHandler) return;
        sparkleHandler = onMove;
        window.addEventListener('mousemove', sparkleHandler, { passive: true });
    }
    function stopSparkles() {
        if (!sparkleHandler) return;
        window.removeEventListener('mousemove', sparkleHandler);
        sparkleHandler = null;
        document.querySelectorAll('.retro-sparkle').forEach(function (n) { n.remove(); });
    }

    /* ─────────── Toggle wiring ─────────── */
    function wireToggle() {
        var year = new Date().getFullYear();
        document.querySelectorAll('.retro-toggle').forEach(function (btn) {
            btn.setAttribute('data-year', year);
            btn.addEventListener('click', function () { setRetro(!isRetro()); });
        });
    }

    /* ─────────── Guestbook AJAX (so Web3Forms' success page never appears) ─────────── */
    function wireGuestbook() {
        var form = document.querySelector('.retro-guestbook-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var original = btn ? btn.textContent : '';
            if (btn) { btn.textContent = 'SENDING...'; btn.disabled = true; }
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            }).then(function (r) { return r.json(); })
            .then(function (j) {
                if (!j || !j.success) throw new Error(j && j.message || 'Submission failed');
                form.outerHTML =
                    '<div class="retro-guestbook-thanks" style="padding: 1rem;">' +
                      '<font face="Impact" color="#ffff00" size="6">' +
                        '<span class="retro-blink">★</span> THANKS FOR SIGNING!! <span class="retro-blink">★</span>' +
                      '</font><br><br>' +
                      '<font face="Comic Sans MS" color="#00ffff" size="4">' +
                        '<b>Your message has been delivered to cyberspace!!</b>' +
                      '</font><br><br>' +
                      '<font face="Times New Roman" color="#ffffff" size="3">' +
                        'I will read it next time I check my e-mail.<br>' +
                        'Thanks for stopping by &mdash; come back soon!!' +
                      '</font><br><br>' +
                      '<img src="/files/retro/gifs/3JBOPCYOETGTI3HZDJD4SJR64UW4Q6UW.gif" alt="email" width="115" height="101">' +
                    '</div>';
            }).catch(function () {
                if (btn) { btn.textContent = original; btn.disabled = false; }
                alert('Sorry, your message could not be sent. Please try again!');
            });
        });
    }

    /* ─────────── Boot ─────────── */
    document.addEventListener('DOMContentLoaded', function () {
        wireToggle();
        wireGuestbook();
        if (isRetro()) {
            renderDecorations();
            startSparkles();
            bumpHitCounter();
        }
    });

    // Re-render decorations on resize so the scatter still feels right
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        if (!isRetro()) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderDecorations, 250);
    });
})();
