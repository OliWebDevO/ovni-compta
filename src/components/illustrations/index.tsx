// Illustrations SVG pour O.V.N.I Compta
// Style moderne et amical inspiré d'Accountable

interface IllustrationProps {
  className?: string;
  size?: number;
}

// Illustration d'un personnage avec des documents/factures
export function IllustrationDocuments({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="55" fill="#EDE9FE" />

      {/* Document stack */}
      <rect x="30" y="35" width="45" height="55" rx="4" fill="#FBBF24" />
      <rect x="35" y="30" width="45" height="55" rx="4" fill="#FDE68A" />
      <rect x="40" y="25" width="45" height="55" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="2" />

      {/* Document lines */}
      <rect x="48" y="35" width="25" height="3" rx="1.5" fill="#A78BFA" />
      <rect x="48" y="43" width="30" height="2" rx="1" fill="#E5E7EB" />
      <rect x="48" y="49" width="28" height="2" rx="1" fill="#E5E7EB" />
      <rect x="48" y="55" width="20" height="2" rx="1" fill="#E5E7EB" />

      {/* Euro symbol */}
      <circle cx="80" cy="75" r="18" fill="#10B981" />
      <text x="80" y="82" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">€</text>

      {/* Small decorative elements */}
      <circle cx="25" cy="25" r="4" fill="#FDE68A" />
      <circle cx="95" cy="30" r="3" fill="#A78BFA" />
      <circle cx="100" cy="95" r="5" fill="#86EFAC" />
    </svg>
  );
}

// Illustration d'un graphique/tendance
export function IllustrationChart({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#DBEAFE" />

      {/* Chart background */}
      <rect x="20" y="30" width="80" height="60" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="2" />

      {/* Grid lines */}
      <line x1="20" y1="50" x2="100" y2="50" stroke="#F3F4F6" strokeWidth="1" />
      <line x1="20" y1="70" x2="100" y2="70" stroke="#F3F4F6" strokeWidth="1" />

      {/* Bar chart */}
      <rect x="30" y="55" width="12" height="30" rx="2" fill="#86EFAC" />
      <rect x="47" y="45" width="12" height="40" rx="2" fill="#86EFAC" />
      <rect x="64" y="60" width="12" height="25" rx="2" fill="#FDA4AF" />
      <rect x="81" y="40" width="12" height="45" rx="2" fill="#86EFAC" />

      {/* Trend line */}
      <path d="M25 70 Q45 50, 60 55 T95 40" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Decorative dots */}
      <circle cx="25" cy="70" r="4" fill="#8B5CF6" />
      <circle cx="60" cy="55" r="4" fill="#8B5CF6" />
      <circle cx="95" cy="40" r="4" fill="#8B5CF6" />

      {/* Small stars */}
      <circle cx="105" cy="25" r="3" fill="#FDE68A" />
      <circle cx="15" cy="90" r="4" fill="#A78BFA" />
    </svg>
  );
}

// Illustration d'un artiste/personne
export function IllustrationArtist({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#FCE7F3" />

      {/* Body */}
      <ellipse cx="60" cy="95" rx="25" ry="15" fill="#8B5CF6" />

      {/* Head */}
      <circle cx="60" cy="50" r="22" fill="#FDE68A" />

      {/* Hair */}
      <path d="M38 45 Q40 25, 60 25 Q80 25, 82 45" stroke="#7C3AED" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Face */}
      <circle cx="52" cy="48" r="3" fill="#1F2937" />
      <circle cx="68" cy="48" r="3" fill="#1F2937" />
      <path d="M54 58 Q60 63, 66 58" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Musical note */}
      <circle cx="90" cy="35" r="12" fill="#10B981" />
      <text x="90" y="40" textAnchor="middle" fill="white" fontSize="14">♪</text>

      {/* Stars */}
      <circle cx="25" cy="30" r="4" fill="#FDE68A" />
      <circle cx="95" cy="85" r="3" fill="#86EFAC" />
      <circle cx="20" cy="75" r="3" fill="#A78BFA" />
    </svg>
  );
}

// Illustration d'un projet/dossier
export function IllustrationProject({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#F3E8FF" />

      {/* Folder back */}
      <path d="M25 45 L25 85 Q25 90, 30 90 L90 90 Q95 90, 95 85 L95 45 Z" fill="#A78BFA" />

      {/* Folder tab */}
      <path d="M25 45 L25 40 Q25 35, 30 35 L50 35 L55 45 Z" fill="#A78BFA" />

      {/* Folder front */}
      <path d="M25 50 L25 85 Q25 90, 30 90 L90 90 Q95 90, 95 85 L95 50 Q95 45, 90 45 L30 45 Q25 45, 25 50 Z" fill="#C4B5FD" />

      {/* Documents inside */}
      <rect x="35" y="55" width="30" height="25" rx="2" fill="white" />
      <rect x="40" y="60" width="15" height="2" rx="1" fill="#E5E7EB" />
      <rect x="40" y="65" width="20" height="2" rx="1" fill="#E5E7EB" />
      <rect x="40" y="70" width="12" height="2" rx="1" fill="#E5E7EB" />

      {/* Checkmark */}
      <circle cx="80" cy="70" r="12" fill="#10B981" />
      <path d="M74 70 L78 74 L86 66" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Decorative */}
      <circle cx="20" cy="25" r="4" fill="#FDE68A" />
      <circle cx="100" cy="30" r="3" fill="#86EFAC" />
      <circle cx="105" cy="95" r="4" fill="#FDA4AF" />
    </svg>
  );
}

// Illustration pour état vide
export function IllustrationEmpty({ className = '', size = 150 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blobs */}
      <ellipse cx="75" cy="120" rx="60" ry="15" fill="#F3F4F6" />

      {/* Box */}
      <rect x="40" y="50" width="70" height="60" rx="6" fill="#E5E7EB" />
      <rect x="45" y="45" width="70" height="60" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />

      {/* Open box flaps */}
      <path d="M45 50 L60 35 L80 35 L115 50" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
      <path d="M45 50 L30 40 L45 30 L60 35" fill="#EDE9FE" stroke="#E5E7EB" strokeWidth="2" />
      <path d="M115 50 L125 40 L115 30 L100 35" fill="#DBEAFE" stroke="#E5E7EB" strokeWidth="2" />

      {/* Sparkles indicating empty */}
      <circle cx="80" cy="75" r="3" fill="#A78BFA" />
      <path d="M75 70 L85 80 M85 70 L75 80" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />

      {/* Floating elements */}
      <circle cx="30" cy="60" r="4" fill="#FDE68A" />
      <circle cx="125" cy="55" r="3" fill="#86EFAC" />
      <circle cx="35" cy="30" r="3" fill="#FDA4AF" />
      <circle cx="120" cy="25" r="4" fill="#A78BFA" />

      {/* Question marks */}
      <text x="60" y="25" fill="#C4B5FD" fontSize="16" fontWeight="bold">?</text>
      <text x="100" y="20" fill="#93C5FD" fontSize="12" fontWeight="bold">?</text>
    </svg>
  );
}

// Illustration de succès/célébration
export function IllustrationSuccess({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#D1FAE5" />

      {/* Trophy */}
      <path d="M45 40 L45 65 Q45 80, 60 80 Q75 80, 75 65 L75 40 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />

      {/* Trophy handles */}
      <path d="M45 45 Q30 45, 30 55 Q30 65, 45 65" stroke="#F59E0B" strokeWidth="3" fill="none" />
      <path d="M75 45 Q90 45, 90 55 Q90 65, 75 65" stroke="#F59E0B" strokeWidth="3" fill="none" />

      {/* Trophy base */}
      <rect x="50" y="80" width="20" height="5" fill="#F59E0B" />
      <rect x="45" y="85" width="30" height="8" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />

      {/* Star on trophy */}
      <polygon points="60,48 63,54 70,55 65,60 66,67 60,64 54,67 55,60 50,55 57,54" fill="#F59E0B" />

      {/* Confetti */}
      <circle cx="25" cy="30" r="4" fill="#A78BFA" />
      <circle cx="95" cy="25" r="3" fill="#FDA4AF" />
      <circle cx="20" cy="70" r="3" fill="#86EFAC" />
      <circle cx="100" cy="80" r="4" fill="#FDE68A" />
      <rect x="85" y="35" width="6" height="6" rx="1" fill="#93C5FD" transform="rotate(45 88 38)" />
      <rect x="28" y="85" width="5" height="5" rx="1" fill="#FDA4AF" transform="rotate(30 30 87)" />

      {/* Sparkle lines */}
      <path d="M35 20 L40 25 M40 20 L35 25" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
      <path d="M80 15 L85 20 M85 15 L80 20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Petit mascotte OVNI (soucoupe volante)
export function IllustrationOVNI({ className = '', size = 80 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Beam */}
      <path d="M25 55 L40 45 L55 55 L60 75 L20 75 Z" fill="#FDE68A" fillOpacity="0.4" />

      {/* UFO body */}
      <ellipse cx="40" cy="40" rx="28" ry="10" fill="#8B5CF6" />

      {/* UFO dome */}
      <ellipse cx="40" cy="35" rx="15" ry="12" fill="#C4B5FD" />
      <ellipse cx="40" cy="33" rx="10" ry="8" fill="#EDE9FE" />

      {/* Lights */}
      <circle cx="25" cy="42" r="3" fill="#FDE68A" />
      <circle cx="40" cy="44" r="3" fill="#86EFAC" />
      <circle cx="55" cy="42" r="3" fill="#FDA4AF" />

      {/* Eyes in dome */}
      <circle cx="35" cy="32" r="3" fill="#1F2937" />
      <circle cx="45" cy="32" r="3" fill="#1F2937" />
      <circle cx="36" cy="31" r="1" fill="white" />
      <circle cx="46" cy="31" r="1" fill="white" />

      {/* Stars around */}
      <circle cx="10" cy="20" r="2" fill="#FDE68A" />
      <circle cx="70" cy="15" r="2" fill="#A78BFA" />
      <circle cx="65" cy="60" r="2" fill="#86EFAC" />
      <circle cx="12" cy="55" r="2" fill="#FDA4AF" />
    </svg>
  );
}

// Illustration wallet/portefeuille
export function IllustrationWallet({ className = '', size = 120 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="60" cy="60" r="55" fill="#FEF3C7" />

      {/* Wallet body */}
      <rect x="25" y="40" width="70" height="45" rx="6" fill="#8B5CF6" />
      <rect x="25" y="40" width="70" height="15" rx="6" fill="#7C3AED" />

      {/* Wallet flap */}
      <path d="M25 45 Q25 35, 35 35 L85 35 Q95 35, 95 45" fill="#A78BFA" />

      {/* Card slot */}
      <rect x="60" y="55" width="30" height="20" rx="3" fill="#C4B5FD" />
      <rect x="65" y="60" width="20" height="3" rx="1.5" fill="#8B5CF6" />
      <rect x="65" y="66" width="15" height="2" rx="1" fill="#8B5CF6" opacity="0.5" />

      {/* Coins */}
      <circle cx="40" cy="95" r="10" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      <text x="40" y="99" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="bold">€</text>

      <circle cx="55" cy="100" r="8" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />

      {/* Bills */}
      <rect x="70" y="88" width="25" height="15" rx="2" fill="#86EFAC" stroke="#10B981" strokeWidth="1" transform="rotate(-10 82 95)" />

      {/* Decorative */}
      <circle cx="20" cy="25" r="4" fill="#FDA4AF" />
      <circle cx="100" cy="30" r="3" fill="#86EFAC" />
      <circle cx="105" cy="90" r="3" fill="#93C5FD" />
    </svg>
  );
}
