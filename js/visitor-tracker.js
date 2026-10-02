(function () {

    const SUPABASE_URL = "https://mzvwjacbobiyjrxedlef.supabase.co";
    const SUPABASE_KEY = "sb_publishable_q_F2HIAo7lB2M_kFLssXmQ_Y-vcLthd";

    const SUPABASE_SCRIPT =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    function loadSupabase() {

        return new Promise((resolve, reject) => {

            if (window.supabase) {
                resolve(window.supabase);
                return;
            }

            const script = document.createElement("script");

            script.src = SUPABASE_SCRIPT;

            script.onload = function () {
                resolve(window.supabase);
            };

            script.onerror = function () {
                reject(new Error("Supabase library failed to load."));
            };

            document.head.appendChild(script);
        });
    }


    function getSessionId() {

        let sessionId = localStorage.getItem("portfolio_session_id");

        if (!sessionId) {

            sessionId =
                "sess_" +
                Date.now() +
                "_" +
                Math.random().toString(36).substring(2, 12);

            localStorage.setItem(
                "portfolio_session_id",
                sessionId
            );
        }

        return sessionId;
    }


    function detectDevice() {

        const width = window.innerWidth;

        if (width <= 767) {
            return "Mobile";
        }

        if (width <= 1024) {
            return "Tablet";
        }

        return "Desktop";
    }


    function detectBrowser() {

        const ua = navigator.userAgent;

        if (ua.includes("Edg/")) {
            return "Microsoft Edge";
        }

        if (ua.includes("OPR/")) {
            return "Opera";
        }

        if (ua.includes("Chrome/")) {
            return "Google Chrome";
        }

        if (ua.includes("Firefox/")) {
            return "Mozilla Firefox";
        }

        if (ua.includes("Safari/")) {
            return "Safari";
        }

        return "Other";
    }


    function detectOS() {

        const ua = navigator.userAgent;

        if (/Windows NT/i.test(ua)) {
            return "Windows";
        }

        if (/Android/i.test(ua)) {
            return "Android";
        }

        if (/iPhone|iPad|iPod/i.test(ua)) {
            return "iOS";
        }

        if (/Mac OS X/i.test(ua)) {
            return "macOS";
        }

        if (/Linux/i.test(ua)) {
            return "Linux";
        }

        return "Other";
    }


    async function trackVisitor() {

        try {

            const supabaseLibrary = await loadSupabase();

            const client =
                supabaseLibrary.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );


            const visitorData = {

                session_id: getSessionId(),

                page_url: window.location.href,

                page_title: document.title || "",

                referrer: document.referrer || "Direct",

                device_type: detectDevice(),

                browser: detectBrowser(),

                operating_system: detectOS(),

                screen_width: window.screen.width,

                screen_height: window.screen.height,

                language: navigator.language || "",

                timezone:
                    Intl.DateTimeFormat().resolvedOptions().timeZone || "",

                user_agent: navigator.userAgent

            };


            const { error } =
                await client
                    .from("visitor_logs")
                    .insert(visitorData);


            if (error) {

                console.error(
                    "Visitor tracking error:",
                    error
                );

            }

        } catch (error) {

            console.error(
                "Visitor tracking failed:",
                error
            );

        }

    }


    trackVisitor();

})();