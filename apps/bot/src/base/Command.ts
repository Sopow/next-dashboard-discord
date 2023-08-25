import { Message } from 'discord.js';
import Client from './Client'; // Assurez-vous de fournir le chemin correct vers le module CustomClient
import { Plugins } from '../../../../@types';

/**
 * Represents a command
 */
class Command {
    client: Client;
    help: {
        name: string | null;
        description: string;
        usage: string;
        category: Plugins;
        examples?: string[];
        options?: any[];
    };
    conf: {
        cooldown: number;
        adminOnly?: boolean;
        isConfig?: boolean;
        ownerOnly?: boolean;
    };
    cooldown: Set<string>;
    message?: Message;
    data: any;
    execute: (...args: any[]) => void;

    /**
     * @param {CustomClient} client The client used in the command 
     * @param {Object} options The command's configuration
     */
    constructor(client: Client, options: any) {
        this.client = client;
        this.help = {
            name: options.name || null,
            description: options.description || "No information specified.",
            usage: options.usage || "",
            category: options.category || "utilities"
        };
        this.cooldown = new Set();
    }
}

export default Command;
