import CanvasModel from "@/canvas";
import "./globals.css";

export const metadata = {
    title: "Custommizer",
    description: "Create and customise your designs leveraging advanced AI tools"
}

const RootLayout: React.FC<{children: React.ReactNode}> = ({children}) => {

    return (
        <html>
            <body>
                <main className="app transition-all ease-in">
                    {children}
                    <CanvasModel />
                </main>
            </body>
        </html>
    )
}

export default RootLayout;