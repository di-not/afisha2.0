import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface passwordInputProps {
    formStates: any;
    name: string;
    placeholder: string;
}

const PasswordInput: React.FC<passwordInputProps> = ({
    name,
    formStates,
    placeholder,
}) => {
    const [openSymbols, setOpenSymbols] = useState(false);
    return (
        <div className="relative w-full">
            <input
                type={openSymbols ? "text" : "password"}
                {...formStates.register(name)}
                className={`bgInput p-2.5 pl-5 pr-14 w-full`}
                style={{ caretColor: "#fff" }}
                placeholder={placeholder}
            />

            <button
                className="absolute right-5 bottom-0 top-0"
                type="button"
                onClick={() => {
                    setOpenSymbols(!openSymbols);
                }}
            >
                {!openSymbols ? (
                    <EyeOff color="rgba(255,255,255,0.3)" />
                ) : (
                    <Eye color="rgba(255,255,255,0.3)" />
                )}
            </button>
        </div>
    );
};
export { PasswordInput };
