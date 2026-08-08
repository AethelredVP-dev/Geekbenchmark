import { Box, Divider } from "@mui/material"
import TextType from '../assets/ui/TextType';
import ShinyText from '../assets/ui/ShinyText';
import { context } from '../helpers/CONTEXT';
import { useContext } from 'react';

const Header = () => {
    const { darkMode } = useContext(context);
    return (
        <>
            <Box sx={{ fontSize: "2rem", textAlign: "center", mb: 4 }}>
                <ShinyText
                    text="Geek Benchmarker"
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