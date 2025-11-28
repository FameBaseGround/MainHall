const fs = require('fs');
const path = require('path');

// Định nghĩa các hằng số
const PROJECTS_DIR = 'projects';
const LEADERBOARD_FILE = 'HALLOFFAME.md';
const README_FILENAME = 'README.md';

/**
 * Hàm chính để tạo nội dung cho HALLOFFAME.md.
 */
function generateLeaderboard() {
    console.log(`Bắt đầu tạo file ${LEADERBOARD_FILE}...`);

    // 1. Kiểm tra xem thư mục 'projects' có tồn tại không
    const projectsPath = path.join(PROJECTS_DIR);
    if (!fs.existsSync(projectsPath)) {
        console.error(`Lỗi: Thư mục "${PROJECTS_DIR}" không tồn tại tại ${projectsPath}.`);
        return;
    }

    try {
        // 2. Đọc danh sách các mục (files/folders) trong thư mục 'projects'
        const projectFolders = fs.readdirSync(projectsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory()) // Chỉ lấy thư mục con
            .map(dirent => dirent.name);

        if (projectFolders.length === 0) {
            console.log(`Không tìm thấy thư mục project nào trong thư mục "${PROJECTS_DIR}".`);
            // Có thể tạo một HALLOFFAME file rỗng với tiêu đề
            const initialContent = `# Project Leaderboard\n\nKhông có project nào được tìm thấy.`;
            fs.writeFileSync(path.join(LEADERBOARD_FILE), initialContent);
            console.log(`Đã tạo ${LEADERBOARD_FILE} nhưng không có liên kết project.`);
            return;
        }

        // 3. Xây dựng nội dung Markdown cho HALLOFFAME
        let content = `# Project Leaderboard\n\n`;
        content += `Đây là danh sách các dự án có sẵn. Bấm vào tên dự án để xem chi tiết:\n\n`;
        
        projectFolders.forEach(folderName => {
            const readmePathRelative = path.join(PROJECTS_DIR, folderName, README_FILENAME);
            const readmePathAbsolute = path.join(projectsPath, folderName, README_FILENAME);

            // Kiểm tra xem README.md có tồn tại trong thư mục project không
            if (fs.existsSync(readmePathAbsolute)) {
                // Tạo liên kết Markdown: [Tên Project](đường dẫn tương đối tới README.md)
                // Ví dụ: [project-a](projects/project-a/README.md)
                
                // Chuẩn hóa tên thư mục để dùng làm tiêu đề.
                // Ví dụ: 'project-a' -> 'Project A'
                const displayName = folderName
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                // Sử dụng đường dẫn tương đối (relative path)
                const markdownLink = `- [**${displayName}**](${readmePathRelative})\n`;
                content += markdownLink;
            } else {
                console.warn(`Cảnh báo: Không tìm thấy ${README_FILENAME} trong thư mục "${folderName}". Bỏ qua.`);
                // Có thể thêm tên project mà không có link nếu cần:
                // content += `- ${folderName} (README.md không có)\n`;
            }
        });

        // 4. Ghi nội dung đã tạo vào file HALLOFFAME.md
        const HALLOFFAMEFilePath = path.join(LEADERBOARD_FILE);
        fs.writeFileSync(HALLOFFAMEFilePath, content);

        console.log(`\n✅ Đã tạo/cập nhật thành công file: **${LEADERBOARD_FILE}**`);
        console.log(`   Tìm thấy ${projectFolders.length} thư mục project.`);
        console.log(`   Tổng số liên kết README được thêm: ${content.split('\n').filter(line => line.startsWith('- [')).length}`);

    } catch (err) {
        console.error(`\n❌ Lỗi trong quá trình xử lý file:`, err);
    }
}

// Chạy hàm chính
generateLeaderboard();