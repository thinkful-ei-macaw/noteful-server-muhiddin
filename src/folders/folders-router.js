const path = require('path');
const express = require('express');
const xss = require('xss');
const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  folder_id: folder.folder_id,
  folder_name: xss(folder.folder_name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    if (name === null) {
      return res.status(400).json({
        error: { message: `Missing '${folder_name}' in request body` }
      });
    }

    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.folder_id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });

foldersRouter
  .route('/:folder_id/notes')
  .all((req, res, next) => {
    const { folder_id } = req.params;
    FoldersService.getFolderNotes(
      req.app.get('db'),
      folder_id
    )
      .then(notes => {
        if (!notes) {
          return res.status(404).json({
            // eslint-disable-next-line quotes
            error: { message: `Notes don't exist` }
          });
        }
        res.notes = notes;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.notes);
  });

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist' }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const folder_name = req.body.folder_name;
    const folderToUpdate = { folder_name };

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body must contain \'folder name\''
        }
      });

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = foldersRouter;