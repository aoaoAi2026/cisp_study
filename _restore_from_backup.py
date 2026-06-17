"""从 E:\internal_safe\cisp11\cisp1\cisp 恢复新版源文件到当前工作区"""
import os
import shutil

BACKUP = r"E:\internal_safe\cisp11\cisp1\cisp"
CURRENT = r"e:\internal_safe\cisp1\cisp"

# ============== 1. 恢复 src/data/ ==============
print("=" * 60)
print("1. 恢复 src/data/ (扁平化新版)")

data_current = os.path.join(CURRENT, "src", "data")
data_backup = os.path.join(BACKUP, "src", "data")

# 1a. 删除当前所有子目录
subdirs_to_delete = [
    "cyberSecurity", "cybersecurityData", "emergencyScenarios",
    "learningData", "mockExamQuestions", "pastPapers", "plans",
    "resourceData", "securityScripts", "toolSitesData", "types"
]
for sub in subdirs_to_delete:
    path = os.path.join(data_current, sub)
    if os.path.isdir(path):
        shutil.rmtree(path)
        print(f"  删除目录: {sub}/")

# 1b. 删除当前存在但备份中不存在的文件
files_to_delete = [
    "codeSnippets.ts", "dayExpertNotes.ts", "experiments.ts",
    "mockExamQuestions.ts", "supplementLoader.ts", "weekThemes.ts"
]
for f in files_to_delete:
    path = os.path.join(data_current, f)
    if os.path.isfile(path):
        os.remove(path)
        print(f"  删除文件: {f}")

# 1c. 从备份复制所有 .ts 和 .cjs 文件
backup_files = [f for f in os.listdir(data_backup) 
                if f.endswith(('.ts', '.cjs')) and os.path.isfile(os.path.join(data_backup, f))]
for f in backup_files:
    src = os.path.join(data_backup, f)
    dst = os.path.join(data_current, f)
    shutil.copy2(src, dst)
    size_kb = os.path.getsize(dst) / 1024
    print(f"  复制: {f} ({size_kb:.1f} KB)")

# ============== 2. 恢复 src/pages/ ==============
print("\n" + "=" * 60)
print("2. 恢复 src/pages/")

pages_current = os.path.join(CURRENT, "src", "pages")
pages_backup = os.path.join(BACKUP, "src", "pages")

# 2a. 删除子目录中不存在的
pages_subdirs_delete = ["CodeRunner", "CyberDailyLearning", "LabEnvironment"]
for sub in pages_subdirs_delete:
    path = os.path.join(pages_current, sub)
    if os.path.isdir(path):
        shutil.rmtree(path)
        print(f"  删除目录: {sub}/")

# 2b. 从备份复制根级页面文件
pages_to_copy = [
    "CodeLab.tsx", "CodeRunner.tsx", "CyberDailyLearning.tsx",
    "LabEnvironment.tsx", "MockExam.tsx"
]
for f in pages_to_copy:
    src = os.path.join(pages_backup, f)
    dst = os.path.join(pages_current, f)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        size_kb = os.path.getsize(dst) / 1024
        print(f"  复制: {f} ({size_kb:.1f} KB)")

# 2c. 恢复 CodeLab/ 子目录
print("\n  处理 CodeLab/ 子目录...")
codelab_current = os.path.join(pages_current, "CodeLab")
codelab_backup = os.path.join(pages_backup, "CodeLab")

# 删除当前 CodeLab/ 中备份没有的文件
codelab_files_delete = ["constants.ts", "EmergencyTab.tsx", "LawsTab.tsx"]
for f in codelab_files_delete:
    path = os.path.join(codelab_current, f)
    if os.path.isfile(path):
        os.remove(path)
        print(f"    删除: CodeLab/{f}")

# 从备份复制 CodeLab/ 文件
for f in os.listdir(codelab_backup):
    src = os.path.join(codelab_backup, f)
    dst = os.path.join(codelab_current, f)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"    复制: CodeLab/{f}")

# 2d. 恢复 MockExam/ 子目录 - 完全替换
print("\n  处理 MockExam/ 子目录...")
mockexam_current = os.path.join(pages_current, "MockExam")
mockexam_backup = os.path.join(pages_backup, "MockExam")

if os.path.isdir(mockexam_current):
    shutil.rmtree(mockexam_current)
    print(f"    删除旧 MockExam/ 目录")
os.makedirs(mockexam_current, exist_ok=True)

for f in os.listdir(mockexam_backup):
    src = os.path.join(mockexam_backup, f)
    dst = os.path.join(mockexam_current, f)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"    复制: MockExam/{f}")

# ============== 3. 检查索引文件 ==============
print("\n" + "=" * 60)
print("3. 检查 pages/index.ts")

pages_index = os.path.join(pages_current, "index.ts")
pages_index_backup = os.path.join(pages_backup, "index.ts")
shutil.copy2(pages_index_backup, pages_index)
print(f"  已同步 pages/index.ts")

print("\n" + "=" * 60)
print("恢复完成！")
print("请运行 npx tsc --noEmit 检查编译状态。")
