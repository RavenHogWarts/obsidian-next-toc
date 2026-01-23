import type { BaseTranslation } from "../i18n-types";

const fr = {
	commands: {
		openTocView: "Ouvrir la vue de la table des matières",
		returnToCursor: "Retourner au curseur",
		scrollToTop: "Faire défiler vers le haut",
		scrollToBottom: "Faire défiler vers le bas",
		navigatePreviousHeading: "Naviguer vers le titre précédent",
		navigateNextHeading: "Naviguer vers le titre suivant",
		tocExpand: "Développer/réduire la table des matières",
		insertReadingTimeCard: "Insérer la carte de temps de lecture",
		insertTableOfContentsCard: "Insérer la carte de table des matières",
		addCurrentFileToHideHeadingNumberBlacklist:
			"Basculer le fichier actuel dans la liste noire des numéros de titres",
		addCurrentFolderToHideHeadingNumberBlacklist:
			"Basculer le dossier actuel dans la liste noire des numéros de titres",
	},
	notices: {
		alreadyCovered: "Déjà couvert par les motifs existants",
		added: "Ajouté",
		addedAndRemovedRedundant:
			"Ajouté et supprimé {count:number} motif(s) redondant(s)",
		notInBlacklist: "Pas dans la liste noire",
		removed: "Supprimé",
		coveredByPattern:
			"Couvert par un motif. Supprimez le motif manuellement si nécessaire",
	},
	view: {
		view_empty:
			"Aucun titre trouvé. Veuillez vous assurer que le document actuel contient des titres, ou activez la vue de document Markdown.",
	},
	settings: {
		toc: {
			name: "Table des matières",
			show: {
				name: "Afficher la table des matières",
				desc: "Activer ou désactiver la fonctionnalité de table des matières",
			},
			alwaysExpand: {
				name: "Toujours développer la table des matières",
				desc: "Activer ou désactiver le développement permanent de la table des matières. Vous pouvez utiliser la propriété de document `cssclasses` pour contrôler l'affichage et le masquage : ",
			},
			width: {
				name: "Largeur de la table des matières",
				desc: "Définir la largeur de la table des matières",
			},
			position: {
				name: "Position de la table des matières",
				desc: "Définir la position de la table des matières",
				options: {
					left: "Gauche",
					right: "Droite",
				},
			},
			offset: {
				name: "Décalage de la table des matières",
				desc: "Définir le décalage de la table des matières",
			},
			indicatorMode: {
				name: "Mode d'indicateur",
				desc: "Définir le mode d'affichage des indicateurs de la table des matières lorsqu'elle est réduite",
				options: {
					bar: "Barre",
					dot: "Point",
					hidden: "Masqué",
				},
			},
		},
		render: {
			name: "Rendu",
			useHeadingNumber: {
				name: "Utiliser les numéros de titres",
				desc: "Activer ou désactiver l'utilisation des numéros de titres dans la table des matières. Vous pouvez utiliser la propriété de document `cssclasses` pour contrôler l'affichage et le masquage (Priorité supérieure à la liste noire) : ",
			},
			skipHeading1: {
				name: "Ignorer les titres de niveau 1",
				desc: "Activer ou désactiver le fait d'ignorer les titres de niveau 1 dans la table des matières",
			},
			renderMarkdown: {
				name: "Rendre la syntaxe Markdown",
				desc: "Activer ou désactiver le rendu de la syntaxe Markdown dans la table des matières",
			},
			showWhenSingleHeading: {
				name: "Afficher avec un seul titre",
				desc: "Activer ou désactiver l'affichage de la table des matières lorsque le document n'a qu'un seul titre",
			},
			hideHeadingNumberBlacklist: {
				name: "Liste noire des numéros de titres",
				desc: "Spécifiez les fichiers qui doivent masquer les numéros de titres (un chemin par ligne). Prend en charge les caractères génériques : * (tout caractère), ? (caractère unique). Fonctionne uniquement lorsque 'Utiliser les numéros de titres' est activé. Exemple : dossier/fichier.md ou *.md",
			},
		},
		tool: {
			name: "Outils",
			headings: {
				returnButtons: "Groupe de boutons de navigation",
			},
			useToolbar: {
				name: "Utiliser la barre d'outils",
				desc: "Afficher la barre d'outils avec les boutons de navigation",
			},
			showProgressBar: {
				name: "Utiliser la barre de progression",
				desc: "Afficher la barre de progression de lecture au-dessus de la table des matières",
			},
			showProgressCircle: {
				name: "Utiliser le cercle de progression",
				desc: "Afficher l'indicateur circulaire de progression de lecture au-dessus du bouton de basculement, lorsque la table des matières est réduite",
			},
			returnToCursor: {
				name: "Retourner au curseur",
				desc: "Bouton pour retourner à la dernière position du curseur (disponible uniquement en mode édition)",
			},
			returnToTop: {
				name: "Retourner en haut",
				desc: "Bouton pour retourner en haut du document",
			},
			returnToBottom: {
				name: "Retourner en bas",
				desc: "Bouton pour retourner en bas du document",
			},
			jumpToNextHeading: {
				name: "Aller au titre suivant",
				desc: "Bouton pour aller au titre suivant",
			},
			jumpToPrevHeading: {
				name: "Aller au titre précédent",
				desc: "Bouton pour aller au titre précédent",
			},
		},
	},
	cards: {
		preview: "Aperçu",
		property: "Propriété",
		basicSetting: "Paramètres de base",
		styleSetting: "Design de style",
		readingTimeCard: {
			heading: "Paramètres de la carte de temps de lecture",
			title: "Titre",
			chineseWordsPerMinute: "Mots chinois par minute",
			englishWordsPerMinute: "Mots anglais par minute",
			textBefore: "Texte avant le temps de lecture",
			textAfter: "Texte après le temps de lecture",
			iconName: "Nom de l'icône (de l'ensemble d'icônes Obsidian)",
			removeCodeBlocks: "Supprimer les blocs de code",
			removeWikiLinks: "Supprimer les liens wiki",
			removeImageLinks: "Supprimer les liens d'images",
			removeNormalLinks: "Supprimer les liens normaux",
			showWordCount: "Afficher le nombre de mots",
		},
		tableOfContentsCard: {
			heading: "Paramètres de la carte de table des matières",
			title: "Titre",
			minDepth: "Profondeur minimale des titres",
			maxDepth: "Profondeur maximale des titres",
			redirect: "Activer la redirection vers les titres",
			showNumbers: "Afficher les numéros de titres",
			collapsible: "Rendre la table des matières repliable",
		},
		styles: {
			currentProperties: "Propriétés actuelles",
			addNewProperty: "Ajouter une nouvelle propriété",
			noneCustomProperty: "Aucune propriété personnalisée définie pour ",
		},
	},
	tools: {
		pinTOC: "Épingler/désépingler la table des matières",
		changePosition: "Changer la position de la table des matières",
		expandCollapse:
			"Développer/réduire les éléments de la table des matières",
		leftOffset: "Ajouter un décalage à gauche",
		rightOffset: "Ajouter un décalage à droite",
		copyTOC: "Copier la table des matières dans le presse-papiers",
		returnNavigation: "Navigation de retour",
		returnToCursor: "Au curseur",
		returnToTop: "En haut",
		returnToBottom: "En bas",
		jumpToNextHeading: "Titre suivant",
		jumpToPrevHeading: "Titre précédent",
	},
} satisfies BaseTranslation;

export default fr;
