"use client"
import { Box, Divider } from "@mui/material"
import TextType from "@/ui/TextType";
import { useSelector } from "react-redux";
import ShinyText from "@/ui/ShinyText";
import ThemeButton from "@/ui/ThemeButton";

const Header = () => {
    const { darkMode } = useSelector(state => state.benchmark);
    return (
        <>
            <Box sx={{ fontSize: "2rem", textAlign: "center", mb: 4 }}>
                <ThemeButton />
                <ShinyText
                    text="Geek Benchmark"
                    speed={2}
                    delay={0}
                    color="#D4AF37"
                    shineColor={darkMode ? " #FAFAFA" : "#1A1A1A"}
                    spread={120}
                    direction="left"
                    yoyo={true}
                    pauseOnHover={false}
                    disabled={false}
                />
                <Divider variant="middle" sx={{ borderColor: 'primary', m: '16px 0', }} />
                <TextType
                    text={["From Developers To Gamers"]}
                    typingSpeed={50}
                    pauseDuration={2000}
                    showCursor
                    cursorCharacter="▎"
                    deletingSpeed={50}
                    variableSpeedEnabled={false}
                    variableSpeedMin={60}
                    variableSpeedMax={120}
                    cursorBlinkDuration={0.5}
                />
            </Box>

        </>
    )
}
export default Header