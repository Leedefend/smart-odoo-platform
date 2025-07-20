import os

# 定义模块结构
structure = {
    "smart_core": [
        "__init__.py",
        "__manifest__.py"
    ],
    "smart_core/controllers": [
        "__init__.py",
        "intent_dispatcher.py"
    ],
    "smart_core/core": [
        "__init__.py",
        "intent_router.py",
        "command_registry.py",
        "context.py"
    ],
    "smart_core/commands": [
        "__init__.py",
        "base_command.py",
        "load_view.py",
        "load_records.py"
    ],
    "smart_core/utils": [
        "__init__.py",
        "response_builder.py"
    ],
    "smart_core/security": [
        "__init__.py",
        "auth.py"
    ]
}

# 创建目录和文件
for folder, files in structure.items():
    os.makedirs(folder, exist_ok=True)
    for file in files:
        file_path = os.path.join(folder, file)
        if not os.path.exists(file_path):
            with open(file_path, "w", encoding="utf-8") as f:
                if file == "__manifest__.py":
                    f.write(
                        "{\n"
                        "    'name': 'Smart Core Engine',\n"
                        "    'version': '1.0',\n"
                        "    'summary': 'Structure-Driven Intent-Based Odoo Engine',\n"
                        "    'category': 'Framework',\n"
                        "    'depends': ['base'],\n"
                        "    'data': [],\n"
                        "    'installable': True,\n"
                        "    'application': False,\n"
                        "}\n"
                    )
                else:
                    f.write("")  # 空文件

print("✅ smart_core 模块结构已生成。")
