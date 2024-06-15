from odoo import models, fields, _

class ProjectQuality(models.Model):
    _name = 'project.quality'
    _description = 'Project Quality'

    name = fields.Char(string=_('Quality Check Name'), required=True)
    project_id = fields.Many2one('project.project', string=_('Project'), required=True)
    issue_description = fields.Text(string=_('Issue Description'))
    status = fields.Selection([
        ('open', _('Open')),
        ('in_progress', _('In Progress')),
        ('resolved', _('Resolved')),
    ], string=_('Status'), default='open')
    photo = fields.Binary(string=_('Issue Photo'))
    resolution_description = fields.Text(string=_('Resolution Description'))
