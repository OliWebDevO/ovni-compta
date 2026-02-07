interface InvitationEmailProps {
  inviteType: 'existing' | 'new' | 'viewer';
  artisteName?: string;
  role: 'admin' | 'editor' | 'viewer';
  registerUrl: string;
  notes?: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  editor: 'Éditeur',
  viewer: 'Lecteur (lecture seule)',
};

/** Escape HTML special characters to prevent injection in emails */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getContextBlock({ inviteType, artisteName }: InvitationEmailProps): string {
  const safeArtisteName = artisteName ? escapeHtml(artisteName) : '';
  switch (inviteType) {
    case 'existing':
      return `
        <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 1.5;">
          Votre compte sera automatiquement lié à votre profil artiste :
          <strong>${safeArtisteName}</strong>.
          Vous retrouverez toutes vos transactions et données déjà enregistrées.
        </p>
      `;
    case 'new':
      return `
        <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 1.5;">
          Un nouveau profil artiste sera créé pour vous automatiquement lors de votre inscription.
          Vous pourrez ensuite gérer vos transactions et projets.
        </p>
      `;
    case 'viewer':
      return `
        <p style="margin: 0 0 16px; color: #333333; font-size: 16px; line-height: 1.5;">
          Vous aurez un accès en lecture seule à la comptabilité de l'association.
        </p>
      `;
  }
}

export function buildInvitationEmail(props: InvitationEmailProps): string {
  const { role, registerUrl } = props;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation - O.V.N.I Compta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4338ca, #7c3aed, #c026d3); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                O.V.N.I
                <span style="font-weight: 400; font-size: 16px; opacity: 0.9; margin-left: 8px;">
                  Compta
                </span>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                Bonjour,
              </p>

              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                Vous avez été invité(e) à rejoindre la plateforme de gestion
                comptable de l'ASBL <strong>O.V.N.I</strong>.
              </p>

              ${getContextBlock(props)}

              <!-- Role badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="background-color: #f0f0ff; border-radius: 6px; padding: 8px 14px;">
                    <span style="color: #4338ca; font-size: 13px; font-weight: 600;">
                      Votre rôle : ${ROLE_LABELS[role] || role}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 4px 0 28px;">
                    <a href="${registerUrl}"
                       target="_blank"
                       style="display: inline-block; background: linear-gradient(135deg, #4338ca, #7c3aed); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.2px;">
                      Créer mon compte
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; color: #71717a; font-size: 13px; line-height: 1.5;">
                Ce lien est à usage unique.
              </p>
              <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.5;">
                Si vous n'êtes pas concerné(e) par cette invitation, vous pouvez ignorer cet email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7; text-align: center;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                O.V.N.I ASBL &mdash; Gestion comptable associative
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
