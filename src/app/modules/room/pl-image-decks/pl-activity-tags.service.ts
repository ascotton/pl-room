import { Injectable } from '@angular/core';

@Injectable()
export class PLActivityTagsService {

    constructor(
    ) {
    }

    getTags(type='') {
        const allTags = [
            { key: 'grade-pre-k', label: 'Pre-K', types: ['grade'] },
            { key: 'grade-k-2', label: 'Lower Elementary (Grades K-2)', types: ['grade'] },
            { key: 'grade-3-5', label: 'Elementary (Grades 3-5)', types: ['grade'] },
            { key: 'grade-6-8', label: 'Middle (Grades 6-8)', types: ['grade'] },
            { key: 'grade-9-12', label: 'High School (Grades 9-12)', types: ['grade'] },
            { key: 'grade-adult', label: 'Adult', types: ['grade'] },
            { key: 'articulation', label: 'Articulation', types: ['slt'] },
            { key: 'assistive-technology-at', label: 'Assistive Technology (AT)', types: ['slt', 'ot'] },
            { key: 'auditary-comprehension', label: 'Auditory Comprehension', types: ['slt'] },
            { key: 'augmentative-and-alternative-communication-aac', label: 'Augmentative and Alternative Communication (AAC)', types: ['slt', 'ot'] },
            { key: 'categorizing', label: 'Categorizing', types: ['slt'] },
            { key: 'expressive-language', label: 'Expressive Language', types: ['slt'] },
            { key: 'figurative-language', label: 'Figurative Language', types: ['slt'] },
            { key: 'fluency', label: 'Fluency', types: ['slt'] },
            { key: 'following-directions', label: 'Following Directions', types: ['slt'] },
            { key: 'grammar', label: 'Grammar', types: ['slt'] },
            { key: 'inference', label: 'Inference', types: ['slt'] },
            { key: 'learning-coach', label: 'Learning Coach', types: ['slt', 'ot', 'sped', 'bmh'] },
            { key: 'locative', label: 'Locative', types: ['slt'] },
            { key: 'non-verbal', label: 'Non-Verbal', types: ['slt'] },
            { key: 'oral-motor', label: 'Oral Motor', types: ['slt'] },
            { key: 'perspective-talking', label: 'Perspective Taking', types: ['slt'] },
            { key: 'phonemic-awareness', label: 'Phonemic Awareness', types: ['slt'] },
            { key: 'phonology', label: 'Phonology', types: ['slt'] },
            { key: 'pragmatics', label: 'Pragmatics', types: ['slt'] },
            { key: 'prediction', label: 'Prediction', types: ['slt'] },
            { key: 'problem-solving', label: 'Problem Solving', types: ['slt'] },
            { key: 'receptive-language', label: 'Receptive Language', types: ['slt'] },
            { key: 'sequencing', label: 'Sequencing', types: ['slt'] },
            { key: 'social-language', label: 'Social Language', types: ['slt'] },
            { key: 'speech', label: 'Speech', types: ['slt'] },
            { key: 'summarizing', label: 'Summarizing', types: ['slt'] },
            { key: 'syntax', label: 'Syntax', types: ['slt'] },
            { key: 'vocabulary', label: 'Vocabulary', types: ['slt'] },
            { key: 'voice', label: 'Voice', types: ['slt'] },
            { key: 'wh-questions', label: 'WH-Questions', types: ['slt'] },
            { key: 'writing', label: 'Writing', types: ['slt'] },
            { key: 'community-integration', label: 'Community Integration', types: ['ot'] },
            { key: 'fine-motor-coordination', label: 'Fine Motor Coordination', types: ['ot'] },
            { key: 'gross-motor', label: 'Gross Motor', types: ['ot'] },
            { key: 'group-dynamics', label: 'Group Dynamics', types: ['ot'] },
            { key: 'handwriting', label: 'Handwriting', types: ['ot'] },
            { key: 'life-transitions', label: 'Life Transitions', types: ['ot'] },
            { key: 'motor-planning', label: 'Motor Planning', types: ['ot'] },
            { key: 'muscle-tone-management', label: 'Muscle Tone Management', types: ['ot'] },
            { key: 'postural-mechanisms', label: 'Postural Mechanisms', types: ['ot'] },
            { key: 'self-care-skills', label: 'Self Care Skills', types: ['ot'] },
            { key: 'sensory-processing', label: 'Sensory Processing', types: ['ot'] },
            { key: 'visual-motor', label: 'Visual Motor', types: ['ot'] },
            { key: 'addition', label: 'Addition', types: ['sped'] },
            { key: 'algebra', label: 'Algebra', types: ['sped'] },
            { key: 'decoding', label: 'Decoding', types: ['sped'] },
            { key: 'division', label: 'Division', types: ['sped'] },
            { key: 'geometry', label: 'Geometry', types: ['sped'] },
            { key: 'math', label: 'Math', types: ['sped'] },
            { key: 'multiplication', label: 'Multiplication', types: ['sped'] },
            { key: 'numbers', label: 'Numbers', types: ['sped'] },
            { key: 'pre-algebra', label: 'Pre-Algebra', types: ['sped'] },
            { key: 'reading', label: 'Reading', types: ['sped'] },
            { key: 'reading-comprehension', label: 'Reading Comprehension', types: ['sped'] },
            { key: 'study-skills', label: 'Study Skills', types: ['sped'] },
            { key: 'subtraction', label: 'Subtraction', types: ['sped'] },
            { key: 'anger-management', label: 'Anger Management', types: ['bmh'] },
            { key: 'cognitive-behavior-therapy-or-cbt', label: 'Cognitive-Behavior-Therapy OR CBT', types: ['bmh'] },
            { key: 'emotional-regulation', label: 'Emotional Regulation', types: ['bmh'] },
            { key: 'social-skills', label: 'Social Skills', types: ['bmh'] },
        ];

        if (type) {
            return allTags.filter((tag) => {
                return tag.types.includes(type);
            });
        }
        return allTags;
    }
}
