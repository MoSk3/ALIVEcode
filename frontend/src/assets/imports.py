import os

prefix = "../../../../../assets/images/simulation/"


def format_import(path: str):
    path = prefix + \
        path[path.index("simulation/") + len("simulation/"):].replace("\\", "/")
    name = path.split("/")[-1].split(".")[0]
    print(f"import {name} from '{path}'")


def import_files(path: str):
    if os.path.isdir(path):
        for file_path in os.scandir(path):
            import_files(file_path.path)
    else:
        format_import(path)


if __name__ == "__main__":
    import_files(f'{os.path.dirname(__file__)}/images/simulation/')
