export default function StartResetButton({handleClick, text}){
    return (
        <button 
        className="bg-black text-white font-semibold text-xl px-16 rounded-md"
        onClick={handleClick}>
          {text}
        </button>
    )
}