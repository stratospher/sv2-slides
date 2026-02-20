(function () {
    var SECTIONS = [
        { label: '1 · Pooled Mining',  slides: ['1-how-pooled-mining.html','pooled-mining-and-shares.html','block-header-assembly.html','what-is-a-share.html'] },
        { label: '2 · Stratum V1',     slides: ['2-how-stratum-v1.html','sv1-architecture.html','sv1-intro.html','sv1-step1-tcp.html','mining-subscribe.html','mining-authorize.html','difficulty-and-shares.html','mining-notify.html','miner-knows-from-pool.html','mining-submit.html'] },
        { label: '3 · Exploits!',      slides: ['3-exploits.html','sv1-plaintext-weakness.html','blackhat-mitm-preconditions.html','job-injection-diagram.html','time-segment-timeline.html'] },
        { label: '4 · Intro SV2',      slides: ['4-intro-sv2.html','sv2-security-by-design.html','noise-protocol.html','encrypting-not-enough.html','diffie-hellman-insight.html','diffie-hellman-visual.html','secrecy-to-integrity.html','key-authenticity.html'] },
        { label: '5 · SV2 Fixes',      slides: ['5-how-sv2-prevents-exploits.html'] },
        { label: '6 · Revenue',        slides: ['6-more-revenue-sv2.html','sv2-miner-profitability.html','conclusion-and-roadmap.html'] }
    ];

    var current = window.location.pathname.split('/').pop() || '';
    var activeIdx = -1;
    SECTIONS.forEach(function (s, i) {
        if (s.slides.indexOf(current) !== -1) activeIdx = i;
    });

    var BAR_H = 36;

    /* Build bar */
    var bar = document.createElement('div');
    bar.id = 'sec-bar';
    bar.style.cssText = 'position:absolute;bottom:0;left:0;right:0;z-index:200;height:' + BAR_H + 'px;' +
        'display:flex;align-items:center;padding:0 60px;gap:5px;' +
        'background:rgba(0,0,0,0.9);border-top:1px solid rgba(6,182,212,0.1);';

    var lbl = document.createElement('span');
    lbl.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:9px;" +
        "color:rgba(6,182,212,0.3);letter-spacing:.14em;margin-right:6px;flex-shrink:0;";
    lbl.textContent = 'SECTION';
    bar.appendChild(lbl);

    SECTIONS.forEach(function (s, i) {
        if (i > 0) {
            var sep = document.createElement('span');
            sep.style.cssText = 'color:rgba(6,182,212,0.2);font-size:12px;flex-shrink:0;';
            sep.textContent = '›';
            bar.appendChild(sep);
        }
        var pill = document.createElement('span');
        var on = (i === activeIdx);
        pill.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:10px;" +
            "padding:3px 10px;border-radius:999px;flex-shrink:0;" +
            (on
                ? 'background:rgba(6,182,212,0.18);border:1px solid #22d3ee;color:#22d3ee;font-weight:700;'
                : 'background:rgba(6,182,212,0.03);border:1px solid rgba(6,182,212,0.12);color:rgba(6,182,212,0.3);');
        pill.textContent = s.label;
        bar.appendChild(pill);
    });

    document.body.appendChild(bar);

    /* Push any existing absolute bottom:0 bar (step progress bars) up */
    setTimeout(function () {
        var all = document.querySelectorAll('div');
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.id === 'sec-bar') continue;
            if (el.style.position === 'absolute' && el.style.bottom === '0px') {
                el.style.bottom = BAR_H + 'px';
            }
        }
    }, 0);
}());
