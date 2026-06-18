export interface PlanColor {
  main: string;
  bg: string;
  border: string;
  bgLight: string;
  borderLight: string;
  borderFaint: string;
  borderSoft: string;
  borderStrong: string;
  cardBorder: string;
  textColor: string;
  optionDefault: string;
  optionCorrect: string;
  optionWrong: string;
  optionDim: string;
  btnDefault: string;
  tabActive: string;
}

export const planColor = (planId: string): PlanColor => {
  if (planId === 'cisp') return {
    main: 'text-cyber-green', bg: 'bg-cyber-green', border: 'border-cyber-green',
    bgLight: 'bg-cyber-green/20', borderLight: 'border-cyber-green/40',
    borderFaint: 'border-cyber-green/50', borderSoft: 'border-cyber-green/50',
    borderStrong: 'border-cyber-green/70', cardBorder: 'border-cyber-green/30',
    textColor: 'text-cyber-green',
    optionDefault: 'border-cyber-green/40 bg-white/5 hover:border-cyber-green/70 hover:bg-cyber-green/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-green/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#00cc66] text-black font-semibold hover:bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]',
    tabActive: 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30',
  };
  if (planId === 'basic') return {
    main: 'text-cyber-green', bg: 'bg-cyber-green', border: 'border-cyber-green',
    bgLight: 'bg-cyber-green/20', borderLight: 'border-cyber-green/40',
    borderFaint: 'border-cyber-green/50', borderSoft: 'border-cyber-green/50',
    borderStrong: 'border-cyber-green/70', cardBorder: 'border-cyber-green/30',
    textColor: 'text-cyber-green',
    optionDefault: 'border-cyber-green/40 bg-white/5 hover:border-cyber-green/70 hover:bg-cyber-green/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-green/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#00cc66] text-black font-semibold hover:bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]',
    tabActive: 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30',
  };
  if (planId === 'penetration') return {
    main: 'text-cyber-red', bg: 'bg-cyber-red', border: 'border-cyber-red',
    bgLight: 'bg-cyber-red/20', borderLight: 'border-cyber-red/40',
    borderFaint: 'border-cyber-red/50', borderSoft: 'border-cyber-red/50',
    borderStrong: 'border-cyber-red/70', cardBorder: 'border-cyber-red/30',
    textColor: 'text-cyber-red',
    optionDefault: 'border-cyber-red/40 bg-white/5 hover:border-cyber-red/70 hover:bg-cyber-red/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-red/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#e04444] text-white font-semibold hover:bg-[#ff5555] shadow-[0_0_12px_rgba(255,68,68,0.3)] hover:shadow-[0_0_20px_rgba(255,68,68,0.5)]',
    tabActive: 'bg-cyber-red/20 text-cyber-red border border-cyber-red/30',
  };
  if (planId === 'ai') return {
    main: 'text-gray-200', bg: 'bg-cyber-purple', border: 'border-cyber-purple',
    bgLight: 'bg-cyber-purple/15', borderLight: 'border-white/15',
    borderFaint: 'border-white/25', borderSoft: 'border-white/30',
    borderStrong: 'border-white/40', cardBorder: 'border-white/10',
    textColor: 'text-gray-300',
    optionDefault: 'border-white/30 bg-white/5 text-gray-200 hover:border-white/50 hover:bg-white/10',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-white/15 bg-transparent opacity-40',
    btnDefault: 'bg-[#7b6ba8] text-white font-semibold hover:bg-[#9588c0] shadow-[0_0_12px_rgba(123,107,168,0.35)] hover:shadow-[0_0_18px_rgba(123,107,168,0.5)]',
    tabActive: 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30',
  };
  if (planId === 'hw') return {
    main: 'text-cyber-gold', bg: 'bg-cyber-gold', border: 'border-cyber-gold',
    bgLight: 'bg-cyber-gold/20', borderLight: 'border-cyber-gold/40',
    borderFaint: 'border-cyber-gold/50', borderSoft: 'border-cyber-gold/50',
    borderStrong: 'border-cyber-gold/70', cardBorder: 'border-cyber-gold/30',
    textColor: 'text-cyber-gold',
    optionDefault: 'border-cyber-gold/40 bg-white/5 hover:border-cyber-gold/70 hover:bg-cyber-gold/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-gold/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#e8a020] text-black font-semibold hover:bg-[#ffb830] shadow-[0_0_12px_rgba(232,160,32,0.35)] hover:shadow-[0_0_18px_rgba(232,160,32,0.5)]',
    tabActive: 'bg-cyber-gold/20 text-cyber-gold border border-cyber-gold/30',
  };
  if (planId === 'vendor') return {
    main: 'text-cyber-teal', bg: 'bg-cyber-teal', border: 'border-cyber-teal',
    bgLight: 'bg-cyber-teal/20', borderLight: 'border-cyber-teal/40',
    borderFaint: 'border-cyber-teal/50', borderSoft: 'border-cyber-teal/50',
    borderStrong: 'border-cyber-teal/70', cardBorder: 'border-cyber-teal/30',
    textColor: 'text-cyber-teal',
    optionDefault: 'border-cyber-teal/40 bg-white/5 hover:border-cyber-teal/70 hover:bg-cyber-teal/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-teal/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#14b8a6] text-white font-semibold hover:bg-[#2dd4bf] shadow-[0_0_12px_rgba(20,184,166,0.35)] hover:shadow-[0_0_18px_rgba(20,184,166,0.5)]',
    tabActive: 'bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/30',
  };
  return {
    main: 'text-cyber-blue', bg: 'bg-cyber-blue', border: 'border-cyber-blue',
    bgLight: 'bg-cyber-blue/20', borderLight: 'border-cyber-blue/40',
    borderFaint: 'border-cyber-blue/50', borderSoft: 'border-cyber-blue/50',
    borderStrong: 'border-cyber-blue/70', cardBorder: 'border-cyber-blue/30',
    textColor: 'text-cyber-blue',
    optionDefault: 'border-cyber-blue/40 bg-white/5 hover:border-cyber-blue/70 hover:bg-cyber-blue/15',
    optionCorrect: 'border-cyber-green/60 bg-cyber-green/20',
    optionWrong: 'border-cyber-red/60 bg-cyber-red/20',
    optionDim: 'border-cyber-blue/20 bg-transparent opacity-40',
    btnDefault: 'bg-[#3388ee] text-white font-semibold hover:bg-[#5599ff] shadow-[0_0_12px_rgba(51,136,238,0.3)] hover:shadow-[0_0_20px_rgba(51,136,238,0.5)]',
    tabActive: 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30',
  };
};
