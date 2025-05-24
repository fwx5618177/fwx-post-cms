import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame-dark.css";
import "@milkdown/crepe/theme/nord-dark.css";
import "@milkdown/prose/view/style/prosemirror.css";
import "@milkdown/prose/tables/style/tables.css";
import "@milkdown/prose/gapcursor/style/gapcursor.css";
import { editorViewCtx, serializerCtx } from "@milkdown/kit/core";

const markdown = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`;

const MilkdownEditor: React.FC = () => {
    let crepe: Crepe | undefined;
    const { get } = useEditor(root => {
        crepe = new Crepe({
            root,
            defaultValue: markdown,
            features: {
                [CrepeFeature.Cursor]: false,
                [CrepeFeature.ListItem]: false,
                [CrepeFeature.LinkTooltip]: false,
                [CrepeFeature.ImageBlock]: false,
                [CrepeFeature.BlockEdit]: false,
                [CrepeFeature.Placeholder]: true,
                [CrepeFeature.Toolbar]: false,
            },
        });

        crepe.setReadonly(true);

        return crepe;
    }, []);

    get()
        ?.use(commonmark)
        .action(ctx => {
            const view = ctx.get(editorViewCtx);
            const serializer = ctx.get(serializerCtx);
            console.log(serializer(view.state.doc));
        });

    return <Milkdown />;
};

const ArticleEditMilkdown: React.FC = () => {
    return (
        <MilkdownProvider>
            <MilkdownEditor />
        </MilkdownProvider>
    );
};

export default ArticleEditMilkdown;
