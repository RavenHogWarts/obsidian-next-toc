interface WordCount {
	chineseCount: number;
	englishCount: number;
}

export default function (content: string): WordCount {
	// 提取所有中文字符
	const chineseChars = content.match(/[\u4e00-\u9fff]/g) || [];
	// 移除所有中文字符后，按空格分词计算英文单词
	const englishContent = content
		.replace(/[\u4e00-\u9fff]/g, "") // 移除中文字符
		.replace(/[\p{P}]/gu, " ") // 将标点替换为空格
		.trim();
	const englishWords = englishContent.split(/\s+/).filter(Boolean);

	return {
		chineseCount: chineseChars.length,
		englishCount: englishWords.length,
	};
}
