tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#192337",
                    200: "#222F49",
                    300: "#263450",
                    400: "#1B2436",
                    500: "#485e94",
                    600: "#546fb1",
                    700: "#1c283e"
                },
                blurple: {
                    100: "#36393F",
                    200: "#4E4D73",
                    300: "#DEE0FC",
                    700: "#404EED",
                    900: '#5865F2'
                },
            }
        },
        fontFamily: {
            body: ["Nunito"]
        }
    }
}

const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});