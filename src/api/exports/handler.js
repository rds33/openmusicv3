const autoBind = require('auto-bind');

class ExportsHandler {
    constructor(service, playlistsService, validator) {
        this._service = service;
        this._validator = validator;
        this._playlistsService = playlistsService;

        autoBind(this);
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const userId = request.auth.credentials.id;
        const { playlistId } = request.params;

        await this._playlistsService.getPlaylists(playlistId);
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
          };

        await this._service.sendMessage(
        'export:playlists',
        JSON.stringify(message),
        );

        const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
        });
        response.code(201);
        return response;  
    }
}


module.exports = ExportsHandler;