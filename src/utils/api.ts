import axios from 'axios';
import { DISCORD_WEBHOOK_URL, GIT_USERNAME } from '../config';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ChangelogEntry {
    date: string;
    version: string;
    changes: string[];
}

/**
 * @param data The contact form's datas.
 */
export const sendDiscordWebhook = async (data: ContactFormData): Promise<boolean> => {
    if (!DISCORD_WEBHOOK_URL) {
        console.error("DISCORD_WEBHOOK_URL non configuré. L'envoi du webhook est désactivé.");
        return false;
    }

    const payload = {
        embeds: [
            {
                title: 'Vous avez reçu un message !',
                color: 3447003,
                fields: [
                    { name: 'Nom', value: data.name, inline: true },
                    { name: 'Email', value: data.email, inline: true },
                    { name: 'Message', value: data.message }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('Message Discord envoyé avec succès !');
            return true;
        } else {
            console.error("Erreur lors de l'envoi du message Discord:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Erreur réseau lors de l'envoi du message Discord:", error);
        return false;
    }
};

/**
 * @param githubLink The github project link.
 * @returns A resolved promise with the changelog.
 */
export const fetchChangelogs = async (githubLink: string): Promise<ChangelogEntry[]> => {
    const elements: ChangelogEntry[] = []
    const text = githubLink.split("/");
    const name = text[text.length - 1];

    await axios.get(`https://raw.githubusercontent.com/${GIT_USERNAME}/${name}/main/CHANGELOG.md`).then(data => {
        const logs = data.data.split("&&&&&&");
        for(const log of logs) {
            const lines = log.split("\n");
            let start = lines[0] !== "" ? 0 : 1
            elements.push({
                date: lines[start],
                version: lines[start+1],
                changes: lines.slice(start+2, lines.length - 1)
            });
        }
    }).catch(_ => {
        return []
    })

    return elements;
};

/**
 * @param platform The platform name (github, discord, twitter).
 * @param username The id of the guild/user.
 * @returns A resolved promise with the amount.
 */
/*export const fetchSocialStats = async (platform: string): Promise<number | undefined> => {
    switch(platform) {
        case "Github":
            axios.get(`https://api.github.com/users/${USERNAME}/followers`).then(data => {
                console.log(data.data)
                return data.data.length;
            })
            break;
        case "Discord":
            axios.get(`https://discord.com/api/v10/guilds/${GUILD_ID}`, {
                headers: {
                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`
                }
            }).then(data => {
                 console.log(data.data)
                return data.data.data.approximate_member_count;
            })
            break;
        case "Twitter":
            axios.get(`https://api.twitter.com/2/users/by/username/${X_USERNAME}?user.fields=public_metrics`, {
                headers: {
                    Authorization: `Bearer ${X_TOKEN}`
                }
            }).then(data => {
                 console.log(data.data)
                return data.data.public_metrics.followers_count;
            })
            break;
        default:
            return 0;
    }
};*/

export const fetchSocialStats = async (_platform: string): Promise<number | undefined> => 0;
